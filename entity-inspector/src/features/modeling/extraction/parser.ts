import * as vscode from 'vscode';
import {DEBUG} from '../../../helpers/settings';

import {EIClass, EIMethod, EIPropetry} from '../../../helpers/types';
import * as consts from '../../../helpers/consts';
import { getExternalModel } from './parser-externalmodel';

export class Parser{
    private dataFromWorkspace: EIClass[] = [];
    private currentFile: vscode.Uri | null = null;
    private previousAddedElement: EIClass | EIMethod | EIPropetry | null = null;
    private entityCount = 0;

    public clearData(): void {
        this.dataFromWorkspace = [];
        this.currentFile = null;
        this.previousAddedElement = null;
    }

    public async parseWorkspace(): Promise<EIClass[]> {
        if (DEBUG) console.log("=== Parsing Workspace ===");
        
        // Getting external model if exists
        const model = await getExternalModel();
        for (const eiclass in model ){
            this.dataFromWorkspace.push;
        }
        
        // Getting all project files without external model (eimodel.json)
        const files = await vscode.workspace.findFiles('*', 'eimodel.json');
        if (DEBUG) console.info("Number of files found: " + files.length);
        
        // Getting all entities from each file
        for (const file of files) {
            await this.parseFile(file);
        }

        if (DEBUG) {
            console.log("=== Parsing DONE ===");
        }
        return this.dataFromWorkspace;
    }


    private async parseFile(file: vscode.Uri): Promise<void> {
        this.currentFile = file;
        if (DEBUG) console.log("    Parsing file: " + file.fsPath);

        const textFromFile = await vscode.workspace.fs.readFile(file);
        const lines = textFromFile.toString().split("\n");

        while (lines.length > 0) {
            const line = lines.shift();
            if (line !== undefined){
                this.parseLine(line);
            }
        }
    }

    private async parseLine(line: string){
        if (line.match(new RegExp(consts.CLASS_MARKER, 'gi'))) {
            await this.getEntity(line);
        }
        if (line.match(new RegExp(consts.DESCRIPTION_MARKER, 'gi'))) {
            this.addDescritpion(this.previousAddedElement, line);
        }
        if (line.match(new RegExp(consts.PROPETRY_MARER, 'gi'))) {
            this.addProperty2Entity(line);
        }
        if (line.match(new RegExp(consts.METHOD_MARKER, 'gi'))) {
            this.addMethod2Entity(line);
        }
    }

    private async getEntity(line: string): Promise<void> {
        const name = this.getName(line, consts.CLASS_MARKER, "\\s*(\\w+)");
        
        if (name !== null) {
            for (const entity of this.dataFromWorkspace) {
                if (entity.name === name) {
                    const ERRORTEXT = "Entity <%s> in: %s already exists\n - You can't have two entities with the same name, plese change one of them.";
                    if (DEBUG) console.error(ERRORTEXT, name, this.currentFile!.fsPath);
                    await vscode.window.showErrorMessage(ERRORTEXT, "Ok");
                    return;
                }
            }

            if (DEBUG) console.log("    Entity found: %s", name);
            this.dataFromWorkspace.push(new EIClass(name));
            this.previousAddedElement = this.dataFromWorkspace[this.dataFromWorkspace.length - 1];
        }
        else{
            // WARNING - not named
        }
    }
    
    private addProperty2Entity(line: string): void {
        const name = this.getName(line, consts.PROPETRY_MARER, "\\s*(\\w+)");

        if (name !== null) {
            const eiProperty = new EIPropetry(name);
            const index = this.dataFromWorkspace.length - 1;
            this.dataFromWorkspace[index].properties.push(eiProperty);
            this.previousAddedElement = eiProperty;
        }
        else{
            // WARNING - not named
        }

        if (DEBUG) console.log("        Property found: " + name);
    }
    
    private addMethod2Entity(line: string): void {
        const name = this.getName(line, consts.METHOD_MARKER, "\\s*(\\w+)");

        if (name !== null) {
            const eiMethod = new EIMethod(name);
            const index = this.dataFromWorkspace.length - 1;
            this.dataFromWorkspace[index].methods.push(eiMethod);
            this.previousAddedElement = eiMethod;
        }
        else{
            // WARNING - not named
        }

        if (DEBUG) console.log("        Method found: " + name);
    }

    private addDescritpion(prevElement: EIClass | EIMethod | EIPropetry | null, line: string): void {
        if (prevElement === null){
            // WARNING - unnecessary descritpion
            return;   
        }

        const regex = new RegExp(consts.DESCRIPTION_MARKER + "\\s*(.*)");
        const description = line.match(regex);
        if (description !== null){
            prevElement.description = description[1];
        }
        else{
            // WARNING - empty description
        }
    }

    private getName(line:string, marker:string, conditional:string): string | null{
        const regex = new RegExp(marker + conditional);
        const regName = line.match(regex);
        const name = regName !== null ? regName[1] : null;
        return name;
    }
}