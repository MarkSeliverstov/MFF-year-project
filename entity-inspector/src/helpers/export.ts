import * as vscode from 'vscode';
import {EIClass} from '../helpers/types';

class Classes{
    classes = new Array<EIClass>();
}

export async function exportModel(data: EIClass[]): Promise<void> {
    const modelJson = JSON.stringify(data, null, 4);
    const path = vscode.Uri.file(vscode.workspace.rootPath + "/eimodel-export.json");
    console.log("Exporting model to " + path.fsPath);
    await vscode.workspace.fs.writeFile(path, Buffer.alloc(modelJson.length, modelJson));
    console.log("Exporting done");
}