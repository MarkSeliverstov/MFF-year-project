import * as vscode from 'vscode';
import {AnnotationParser} from './parser';
import * as Providers from './hints/providers';
// import { exportModel } from './modeling/export';
import { AnotationModel, InstanceModel } from './model';
import { AnnotationMarkersConfiguration, AnnotationReaderConfiguration, CommandsConfiguration } from './configuration';
import { ProgressLocation } from 'vscode';
import { convertAnotationsToInstances as convertAnnotationsToInstances } from './converter';
import { exportModel } from './exporter';

let anotationModel: AnotationModel;
let instanceModel: InstanceModel;

// This method is called when your extension is activated
export async function activate(context: vscode.ExtensionContext) {
	console.log('Yep, "entity-inspector" is now active!');
	const parserConfig = new AnnotationReaderConfiguration();
	const anotationConfig = new AnnotationMarkersConfiguration();

	const parser = new AnnotationParser(parserConfig, anotationConfig);





	// const anotations: AnotationModel = parser.parseWorkspace();

	//const storage = new Storage();
	
	//_registerCommands(context, parser, storage);
	//_registerProviders(context);






	// Handle extensions being added or removed
    vscode.extensions.onDidChange(() => {
        parserConfig.updateLanguagesDefinitions();
    }, null, context.subscriptions);

	_registerProviders(context, anotationConfig, parser);
	_registerCommands(context, anotationConfig, parser);
	console.log(vscode.workspace.textDocuments);
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('Oh no, "entity-inspector" is now deactivated!');
}

function _registerCommands(
	context: vscode.ExtensionContext, 
    anotationConfig: AnotationConfiguration,
	parser: AnnotationParser): 
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
			anotationModel = await parser.parseWorkspace(progress, token);
			progress.report({message: "exorting model to annotation-model.json"});
			await exportModel(anotationModel, "annotation-model.json");
			instanceModel = await convertAnnotationsToInstances(anotationModel, anotationConfig);
		});
	};
	context.subscriptions.push(vscode.commands.registerCommand(commands.runParser, runParserHandler));
}

function _registerProviders(
	context: vscode.ExtensionContext, 
	anotationConfig: AnnotationReaderConfiguration,
	parser: AnnotationReaderConfiguration
): void {
	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider(
			{pattern: "**"}, // all files
			new Providers.MarkerProvider(anotationConfig, parser)),
			
		vscode.languages.registerInlineCompletionItemProvider(
			{pattern: "**"},
			new Providers.SuggestionProvider()),
	);
}
