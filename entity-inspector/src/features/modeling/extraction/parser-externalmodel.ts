import * as vscode from 'vscode';
import {DEBUG} from '../../../helpers/settings';

import {EIClass, EIMethod, EIPropetry} from '../../../helpers/types';

export async function getExternalModel(): Promise<EIClass[]> {
        const files = await vscode.workspace.findFiles('eimodel.json');
        const dataFromModel: EIClass[] = [];
        if (files.length === 0) {
            if (DEBUG) console.warn("External model not found");
            return [];
        }
        
        const file = files[0];
        if (DEBUG) console.log("External model found: " + file.fsPath);
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

            dataFromModel.push(eiclass);
        }

        return dataFromModel;
    }