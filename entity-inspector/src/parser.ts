import * as vscode from 'vscode';
import * as fs from 'fs';
import { EIClass } from './helpers';

export function getEntitiesFromFile(file: vscode.Uri) : EIClass[] {
    //console.log("=== getEntitiesFromFile ===");
    let data: EIClass[] = [];
    let entity: EIClass | undefined = undefined;
    let lines = fs.readFileSync(file.fsPath).toString().split("\n");

    while (lines.length > 0) {
        let line = lines.shift();
        if (line === undefined) {
            break;
        }
        if (line.match(/@ei-class/gi)) {
            if (entity !== undefined) {
                //debugLog(entity);
                data.push(entity);
            }
            line = lines.shift();
            let name = line?.match(/class\s+(\w+)/);
            let fromFile = file;
            if (name !== null && name !== undefined) {
                entity = new EIClass(name[1], fromFile);
            }
        }
        if (line?.match(/@ei-attribute/gi)) {
            line = lines.shift();
            let regName = line?.match(/\b(\w+)\b\s*=/gi);
            if (regName !== null && regName !== undefined) {
                let name = regName[0].split(" ")[0];
                if (entity !== undefined) {
                    entity.atributes.push(name);
                }
            }
        }

        if (line?.match(/@ei-method/gi)) {
            line = lines.shift();
            let regName = line?.match(/\b(\w+)\b\(/gi);
            if (regName !== null && regName !== undefined) {
                let name = regName[0].split(" ")[0];
                name = name.slice(0, -1);
                if (entity !== undefined) {
                    entity.methods.push(name);
                }
            }
        }
    }
    
    if (entity !== undefined && data.length !== 0 && entity !== data[data.length - 1]) {
        // debugLog(entity)
        data.push(entity);
    }
    // console.log("==========================");
    return data;
}

function debugLog(entity: EIClass){
    console.log("   Atributes:");
    console.log(entity.atributes);
    console.log("");
    console.log("   Methods:");
    console.log(entity.methods);
}