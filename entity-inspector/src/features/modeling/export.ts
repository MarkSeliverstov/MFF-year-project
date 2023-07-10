import * as vscode from 'vscode';
import {DEBUG} from '../../helpers/settings';
import {EIClass} from '../../helpers/types';

export async function exportModel(data: EIClass[]): Promise<void> {
    const modelJson = JSON.stringify(data, null, 4);
    const path = vscode.Uri.file(vscode.workspace.rootPath + "/eimodel-export.json");

    if (DEBUG) console.log("Exporting model to " + path.fsPath);
    await vscode.workspace.fs.writeFile(path, Buffer.alloc(modelJson.length, modelJson));

    if (DEBUG) console.log("Exporting done");
}