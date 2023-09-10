import * as vscode from 'vscode';

import path = require('path');
import { TextDecoder } from 'util';

const EXTENSION_NAME = "entity-inspector";
const USER_CONFIG = vscode.workspace.getConfiguration(EXTENSION_NAME);
/**
 * User configuration of EI-prefixes.
 */
export class AnnotationMarkersConfiguration{
    public readonly prefixName = () => `@${USER_CONFIG.get('prefixName')}`;
    
    static readonly idMarker = () => `${USER_CONFIG.get('identifierMarker')}`;
    static readonly nameMarker = () => `${USER_CONFIG.get('nameMarker')}`;
    static readonly typeMarker = () => `${USER_CONFIG.get('typeMarker')}`;
    static readonly entityMarker = () => `${USER_CONFIG.get('entityMarker')}`;
    static readonly propertyMarker = () => `${USER_CONFIG.get('propertyMarker')}`;
    //static readonly methodMarker = () => `${USER_CONFIG.get('methodMarker')}`;
    static readonly descriptionMarker = () => `${USER_CONFIG.get('descriptionMarker')}`;

    static readonly prefixValues = () => {
        return [
            AnnotationMarkersConfiguration.idMarker,
            AnnotationMarkersConfiguration.nameMarker,
            AnnotationMarkersConfiguration.typeMarker,
            AnnotationMarkersConfiguration.entityMarker,
            AnnotationMarkersConfiguration.propertyMarker,
            // AnnotationMarkersConfiguration.methodMarker,
            AnnotationMarkersConfiguration.descriptionMarker
        ];
    };
}



/**
 * Awesome parser configuring 
 * helps to determine the format of languages using the installed extensions.
 */
export class AnnotationReaderConfiguration{
    // languageId : Comment configuration
    private readonly commentConfig = new Map<string, CommentConfig | undefined>();
    private readonly languageConfigFiles = new Map<string, string>();
    private readonly languageExtensionToId = new Map<string, string>();

    public constructor() {
        this.updateLanguagesDefinitions();
    }

    /**
     * Generate a map of configuration files by language as defined by default VScode extensions
     * External extensions can override default configurations os VSCode!
     */
    public updateLanguagesDefinitions() {
        this.commentConfig.clear();

        for (const extension of vscode.extensions.all) {
            const packageJSON = extension.packageJSON;

            if (packageJSON.contributes && packageJSON.contributes.languages) {
                for (const language of packageJSON.contributes.languages) {
                    if (language.configuration) {
                        try{
                            for (const extension of language.extensions){
                                this.languageExtensionToId.set(extension, language.id);
                            }
                        }
                        catch{ // if no extensions property in the language
                            continue;
                        }
                        const configPath = path.join(extension.extensionPath, language.configuration);
                        console.log(`${extension.extensionPath}\n${language.configuration}\n${configPath}\n`);
                        this.languageConfigFiles.set(language.id, configPath);
                    }
                }
            }
        }
    }
    /**
     * Adapter getet the configuration information for the specified language by file extension
     */
    public async getCommentConfigurationByExtension(extension: string): 
    Promise<CommentConfig | undefined> {
        const languageId = this.languageExtensionToId.get(extension);
        if (languageId !== undefined){
            return await this.getCommentConfiguration(languageId);
        }
        return undefined;
    }

    /**
     * Gets the configuration information for the specified language
     */
    public async getCommentConfiguration(languageId: string): 
    Promise<CommentConfig | undefined> {

        // check if the language config has already been loaded
        if (this.commentConfig.has(languageId)) {
            return this.commentConfig.get(languageId);
        }

        // if no config exists for this language, back out and leave the language unsupported
        if (!this.languageConfigFiles.has(languageId)) {
            return undefined;
        }

        try {
            // Get the filepath from the map
            const filePath = this.languageConfigFiles.get(languageId) as string;
            const rawContent = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
            const content = new TextDecoder().decode(rawContent);

            // use json5, because the config can contains comments
            const config = JSON.parse(content);

            this.commentConfig.set(languageId, config.comments);

            return config.comments;
        } catch (error) {
            this.commentConfig.set(languageId, undefined);
            return undefined;
        }
    }
}

/**
 * Configurates EI extension commands.
 */
export class CommandsConfiguration{
    public readonly exportModel:string;
    public readonly runParser:string;

    constructor(){
        this.exportModel = `${EXTENSION_NAME}.exportModel`;
        this.runParser = `${EXTENSION_NAME}.runParser`;
    }
}

