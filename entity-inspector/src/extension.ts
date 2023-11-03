import * as vscode from 'vscode';
import { AnnotationReader } from './exporter';
import * as Providers from './hints/providers';
// import { exportModel } from './modeling/export';
import { AnnotationModel, InstanceModel } from './model';
import { AnnotationMarkersConfiguration, AnnotationReaderConfiguration, CommandsConfiguration } from './configuration';
import { ProgressLocation } from 'vscode';
import { createInstanceModel as convertAnnotationsToInstances } from './converter';
import { exportModel } from './exporter';

let anotationModel: AnnotationModel;
let instanceModel: InstanceModel;

// This method is called when your extension is activated
export async function activate(context: vscode.ExtensionContext) {
	console.log('Yep, "entity-inspector" is now active!');
	const parserConfig = new AnnotationReaderConfiguration();
	const anotationConfig = new AnnotationMarkersConfiguration();

	const reader = new AnnotationReader(parserConfig, anotationConfig);

	// Handle extensions being added or removed
    vscode.extensions.onDidChange(() => {
        parserConfig.updateLanguagesDefinitions();
    }, null, context.subscriptions);

	_registerProviders(context, anotationConfig, reader);
	_registerCommands(context, anotationConfig, reader);
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('Oh no, "entity-inspector" is now deactivated!');
}

function _registerCommands(
	context: vscode.ExtensionContext, 
    anotationConfig: AnnotationMarkersConfiguration,
	reader: AnnotationReader): 
void {
	const commands = new CommandsConfiguration();
	const exportModelHandler = async () => {
		console.log("Activated 'export model', exporting...");
		//await exportModel(storage.getCache());
	};

	context.subscriptions.push(vscode.commands.registerCommand(commands.exportModel, exportModelHandler));

	const runParserHandler = async () => {
		vscode.window.withProgress({
			location: ProgressLocation.Notification,
			cancellable: true,
			title: 'Parsing'
		}, async (progress, token) => {
			token.onCancellationRequested(() => {
                console.log("User canceled the parsing");
            });
			anotationModel = await reader.parseWorkspace(progress, token);
			progress.report({message: "exorting model to annotation-model.json"});
            console.log(JSON.stringify(anotationModel));
			//await exportModel(anotationModel, "annotation-model.json");
			//instanceModel = await convertAnnotationsToInstances(anotationModel, anotationConfig);
		});
	};
	context.subscriptions.push(vscode.commands.registerCommand(commands.runParser, runParserHandler));
}

function _registerProviders(
	context: vscode.ExtensionContext, 
	anotationConfig: AnnotationMarkersConfiguration,
	reader: AnnotationReader
): void {
	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider(
			{pattern: "**"}, // all files
			new Providers.MarkerProvider(anotationConfig, reader)),
			
		vscode.languages.registerInlineCompletionItemProvider(
			{pattern: "**"},
			new Providers.SuggestionProvider()),
	);
}
