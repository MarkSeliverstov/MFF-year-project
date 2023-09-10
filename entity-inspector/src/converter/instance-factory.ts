import * as vscode from 'vscode';

import { AnnotationMarkersConfiguration, AnnotationReaderConfiguration } from '../configuration';
import { InstanceModel, Entity, IAnnotation, SourceFileAnnotations, EntityInstance } from "../model";
import {AnnotationReader} from '../exporter';
import { AnnotationModel } from '../model/annotation-model';

let entities: Entity[];

/**
 * Load annotations and convert them into entities and properties.
 */
export async function createInstanceModel(): Promise<InstanceModel> {
    const paths = await vscode.workspace.findFiles("*");
    entities = [];
    // Creates entities from each file
    paths.forEach(async (path) => {
        const reader = new AnnotationReader(
            new AnnotationReaderConfiguration, 
            new AnnotationMarkersConfiguration
        );
        const sourceFileAnnotations = await reader.readAnnotationsFromFile(path);
        if (sourceFileAnnotations !== null) {
            entities.concat(createEntities(sourceFileAnnotations));
        }
    });

    return {entities};
}

/**
 * Creates entities from source annotations
 */
function createEntities(sourceFileAnnotations: SourceFileAnnotations): Entity[] {
    const annotations = sourceFileAnnotations.annotations;
    annotations.sort((a: IAnnotation, b:IAnnotation) => a.lineNumber - b.lineNumber);

    const entities: Entity[] = [];
    for (const entityAnnotations of entityAnnotationIterator(annotations, AnnotationMarkersConfiguration.entityMarker())
    ){
        createEntity(sourceFileAnnotations.relativeFilePath, entityAnnotations);
    }
    return entities;
}


/**
 * Generator: Iterate sorted list of annotations
 */
function* entityAnnotationIterator(
    annotations: IAnnotation[], 
    delimiter: string
){
    let result: IAnnotation[] = [];
    for (const annotation of annotations){
        if (annotation.name === delimiter){
            yield result;
            result = [];
        } else {
            result.push(annotation);
        }
    }
    if (result.length > 0) {yield result;}
}


function createEntity(source: string, entityAnnotations: IAnnotation[]) {
    const idAnnotation = selectAnnotation(entityAnnotations, AnnotationMarkersConfiguration.idMarker());
    const id: string|null = (idAnnotation) ? idAnnotation.value : null;

    const instance = createEntityInstance(source, entityAnnotations);
    if (id){
        for (const e of entities) {
            if (e.identifier === id) {
                e.instances.push(createEntityInstance(source, entityAnnotations));
            } else {
                entities.push({
                    identifier: id,
                    instances: [instance]
                });
            }
        }
    } 
    entities.push({
        identifier: "undefinded",
        instances: [instance]
    });
}

function selectAnnotation(annotations: IAnnotation[], name: string): IAnnotation | null{
    for (const annotation of annotations) {
        if (annotation.name === name) {return annotation;}
    }
    return null;
}

function createEntityInstance(source: string, annotations: IAnnotation[]): EntityInstance {
    const propertie_iterator = entityAnnotationIterator(annotations, AnnotationMarkersConfiguration.propertyMarker());
    const 

}