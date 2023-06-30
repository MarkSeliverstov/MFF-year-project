import * as vscode from 'vscode';
import {EIClass, EIMethod, EIPropetry} from '../helpers/types';
import * as consts from '../helpers/consts';

export class Parser{
    private dataFromWorkspace: EIClass[] = [];
    private currentFile: vscode.Uri | null = null;
    private previousAddedElement: EIClass | EIMethod | EIPropetry | null = null;

    public clearData(): void {
        this.dataFromWorkspace = [];
        this.currentFile = null;
        this.previousAddedElement = null;
    }

    public async getExternalModel(): Promise<void> {
        const files = await vscode.workspace.findFiles('eimodel.json');
        
        if (files.length === 0) {
            console.log("External model not found");
            return;
        }
        
        const file = files[0];
        console.log("External model found: " + file.fsPath);
        const result = await vscode.workspace.fs.readFile(file);
        const model = JSON.parse(result.toString());

        for (const entity of model.classes) {
            const eiclass = new EIClass(entity.name, entity.description);
            const properties = new Array<EIPropetry>();
            const methods = new Array<EIMethod>();

            for (const property of entity.properties) {
                properties.push(new EIPropetry(property.name, property.description));
            }
            for (const method of entity.methods) {
                methods.push(new EIMethod(method.name, method.description));
            }

            eiclass.properties = properties;
            eiclass.methods = methods;

            this.dataFromWorkspace.push(eiclass);
        }
    }

    public async parseWorkspace(): Promise<EIClass[]> {
        console.log("=== parseWorkspace ===");

        await this.getExternalModel();
        
        const files = await vscode.workspace.findFiles('*', 'eimodel*.json');
        console.log("Files found: " + files.length);

        for (const file of files) {
            await this.parseFile(file);
        }

        console.log("=== parsing done ===");
        return this.dataFromWorkspace;
    }


    private async parseFile(file: vscode.Uri): Promise<void> {
        this.currentFile = file;
        console.log("Parsing file: " + file.fsPath);

        const fileText = await vscode.workspace.fs.readFile(file);
        const lines = fileText.toString().split("\n");

        while (lines.length > 0) {
            let line = lines.shift();
            if (line === undefined) {
                break;
            }
            
            if (line.match(new RegExp(consts.CLASS_MARKER, 'gi'))) {
                await this.getEntity(line);
                continue;
            }
            if (line.match(new RegExp(consts.DESCRIPTION_MARKER, 'gi'))) {
                if (this.previousAddedElement !== null) {
                    this.addDescritpion(this.previousAddedElement, line);
                }
                continue;
            }
            if (line.match(new RegExp(consts.PROPETRY_MARER, 'gi'))) {
                this.addProperty2Entity(line);
                continue;
            }
            if (line.match(new RegExp(consts.METHOD_MARKER, 'gi'))) {
                this.addMethod2Entity(line);
                continue;
            }
        }
    }

    private async getEntity(line: string): Promise<void> {
        const regex = new RegExp(consts.CLASS_MARKER + "\\s*(\\w+)");
        const regName = line.match(regex);
        const name = regName !== null ? regName[1] : null;
        
        if (name !== null) {
            for (const entity of this.dataFromWorkspace) {
                if (entity.name === name) {
                    const ERRORTEXT = 
                    "Entity <" + name + "> in: " + this.currentFile!.fsPath + " already exists" + "\n" +
                    "        - You can't have two entities with the same name, plese change one of them.";

                    console.log("[ERROR] " + ERRORTEXT);
                    await vscode.window.showErrorMessage(ERRORTEXT, "Ok");
                    return;
                }
            }

            console.log("   Entity found: " + name);
            this.dataFromWorkspace.push(new EIClass(name));
            this.previousAddedElement = this.dataFromWorkspace[this.dataFromWorkspace.length - 1];
        }
    }
    
    private addProperty2Entity(line: string): void {
        const regex = new RegExp(consts.PROPETRY_MARER + "\\s*(\\w+)");
        const popertyRegex = line.match(regex);
        const propertyString = popertyRegex !== null ? popertyRegex[1] : null;

        if (propertyString !== null) {
            const eiProperty = new EIPropetry(propertyString);
            const index = this.dataFromWorkspace.length - 1;
            this.dataFromWorkspace[index].properties.push(eiProperty);
            this.previousAddedElement = eiProperty;
        }

        console.log("       Property found: " + propertyString);
    }
    
    private addMethod2Entity(line: string): void {

        const regex = new RegExp(consts.METHOD_MARKER + "\\s*(\\w+)");
        const methodRegex = line.match(regex);
        const methodString = methodRegex !== null ? methodRegex[1] : null;

        if (methodString !== null) {
            const eiMethod = new EIMethod(methodString);
            const index = this.dataFromWorkspace.length - 1;
            this.dataFromWorkspace[index].methods.push(eiMethod);
            this.previousAddedElement = eiMethod;
        }

        console.log("       Method found: " + methodString);
    }

    private addDescritpion(prevElement: EIClass | EIMethod | EIPropetry, line: string): void {

        const regex = new RegExp(consts.DESCRIPTION_MARKER + "\\s*(.*)");
        const description = line.match(regex);
        if (description !== null){
            prevElement.description = description[1];
        }
    }
}