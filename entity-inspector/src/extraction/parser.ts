import * as vscode from 'vscode';
import {EIClass, EIMethod, EIPropetry} from '../helpers/classes';
import * as variables from '../helpers/variables';

export class Parser{
    private data: Map<string, EIClass> = new Map<string, EIClass>();
    private currentFile: vscode.Uri | null = null;
    private currentEntity: EIClass | null = null;
    private previousLine: EIClass | EIMethod | EIPropetry | null = null;

    public async parseWorkspace(): Promise<Map<string, EIClass>> {
        try {
            console.log("=== parseWorkspace ===");
            
            const files = await vscode.workspace.findFiles('*', 'eimodel.json');
            console.log("Files found: " + files.length);

            for (const file of files) {
                await this.parseFile(file);
            }

            console.log("=== parsing done ===");
        }
        catch (error) {
            console.log("Error:", error);
        }

        return this.data;
    }

    public async getExternalModel(): Promise<void> {
        try {
            console.log("=== getExternalModel ===");
            const files = await vscode.workspace.findFiles('eimodel.json');
            
            if (files.length === 0) {
                console.log("Model not found");
                return;
            }
            
            console.log("Model found");
            
            for (const file of files) {
                console.log("Model: " + file.fsPath);
                const result = await vscode.workspace.fs.readFile(file);
                const model = JSON.parse(result.toString());
                console.log(model);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    }

    private async parseFile(file: vscode.Uri): Promise<void> {
        
        try {
            this.currentFile = file;
            console.log("Parsing file: " + file.fsPath);

            const fileText = await vscode.workspace.fs.readFile(file);
            const lines = fileText.toString().split("\n");

            while (lines.length > 0) {
                let line = lines.shift();
                if (line === undefined) {
                    break;
                }
                
                if (line.match(new RegExp(variables.classMarker, 'gi'))) {
                    this.getClass(line);
                    continue;
                }
                if (line.match(new RegExp(variables.descriptionMarker, 'gi'))) {
                    this.getDescritpion(line);
                    continue;
                }
                if (line.match(new RegExp(variables.propertyMarker, 'gi'))) {
                    this.getProperty(line);
                    continue;
                }
                if (line.match(new RegExp(variables.methodMarker, 'gi'))) {
                    this.getMethod(line);
                    continue;
                }
            }
        }
        catch (error) {
            console.log("Error:", error);
        }
    }

    private getClass(line: string): void {
        if (this.currentEntity !== null) {
            this.data.set(this.currentEntity.name, this.currentEntity);
            console.log(this.currentEntity);
        }

        const regexx = /@ei-class:\s+(\w+)/;
        const name = line.match(regexx);
        if (name !== null && name !== undefined) {
            this.currentEntity = new EIClass(name[1], this.currentFile!);
        }        

        this.previousLine = this.currentEntity;
    }

    private getDescritpion(line: string): void {
        const regexx = /@ei-description:\s+(.*)/;
        const description = line.match(regexx);
        if (description !== null && description !== undefined) {
            this.previousLine!.description = description[1];   
        }
    }

    private getProperty(line: string): void {
        const regex = /@ei-property:\s+(\w+)\s*(\{type:\s*(\w+),\s*default:\s*(\w+)\})?/;
        const propertyString = line.match(regex);
        if (propertyString !== null && propertyString !== undefined) {
            const property = new EIPropetry(propertyString[1], propertyString[3], propertyString[4]);
            this.currentEntity!.properties.push(property);
        }

        this.previousLine = this.currentEntity;
    }

    private getMethod(line: string): void {
        const regex = /@ei-method:\s+(\w+)\s*(\{type:\s*(\w+)\})?/;
        const methodString = line.match(regex);
        if (methodString !== null && methodString !== undefined) {
            const method = new EIMethod(methodString[1], methodString[3]);
            this.currentEntity!.methods.push(method);
        }

        this.previousLine = this.currentEntity;
    }
}