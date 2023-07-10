import * as vscode from 'vscode';
import {Parser} from './features/modeling/extraction/parser';
import * as Providers from './features/hints/providers/providers';
import { exportModel } from './features/modeling/export';
import {Cache} from './data/cache';

class MyDiagnostic{
	static diagnosticCollection = vscode.languages.createDiagnosticCollection('myDiagnostics');
}

// This method is called when your extension is activated
export async function activate(context: vscode.ExtensionContext) {
	console.log('Yep, "entity-inspector" is now active!');
	
	const parser = new Parser();
	const cache = new Cache();
	
	cache.setCache(await parser.parseWorkspace());
	addDiagnostic(MyDiagnostic.diagnosticCollection);

	const command = "myExtension.exportModel";
	const commandHandler = async () => {
		console.log("Exporting model data");
		console.log(cache.getCache());
		await exportModel(cache.getCache());
	};
	context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));
	
	// Register providers
	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider(
			{pattern: "**"}, // all files
			new Providers.MarkerProvider()),
			
		vscode.languages.registerInlineCompletionItemProvider(
			{pattern: "**"},
			new Providers.SuggestionProvider()),
	);

	vscode.workspace.onDidSaveTextDocument(async (event: vscode.TextDocument) => {
		parser.clearData();
		cache.setCache(await parser.parseWorkspace());	
	});

	vscode.workspace.onDidDeleteFiles(async (event: vscode.FileDeleteEvent) => {
		parser.clearData();
		cache.setCache(await parser.parseWorkspace());
	});
}

// Diagnostic of errors, warnings, infos and hints
function addDiagnostic(diagnosticCollection: vscode.DiagnosticCollection) {
    vscode.workspace.onDidChangeTextDocument((event) => {
        const text = event.document.getText();

        let errors = text.matchAll(/ERROR/gi);
		let warnings = text.matchAll(/WARN/gi);
		let infos = text.matchAll(/INFO/gi);
		let hints = text.matchAll(/HINT/gi);

		let items: any[] = [];
		items = items.concat(addDiagnosticItems(vscode.DiagnosticSeverity.Error, "This is ERROR hover", errors, event));
		items = items.concat(addDiagnosticItems(vscode.DiagnosticSeverity.Warning, "This is WARNING hover", warnings, event));
		items = items.concat(addDiagnosticItems(vscode.DiagnosticSeverity.Information, "This is INFO hover", infos, event));
		items = items.concat(addDiagnosticItems(vscode.DiagnosticSeverity.Hint, "This is HINT hover", hints, event));
		
		diagnosticCollection.set(event.document.uri, items);
    });
}

function addDiagnosticItems(kind: vscode.DiagnosticSeverity, message: string, mathItems: IterableIterator<RegExpMatchArray>, event: vscode.TextDocumentChangeEvent): 
	vscode.Diagnostic[] {

	let items = [];
	for (const match of mathItems) {
		if (match.index === undefined) {
			return [];
		}
		const startPos = event.document.positionAt(match.index);
		const endPos = event.document.positionAt(match.index + match[0].length);
		const range = new vscode.Range(startPos, endPos);
		const diagnostic = new vscode.Diagnostic(range,message, kind);
		items.push(diagnostic);
	}
	if (items.length === 0) {
		return [];
	}
	return items;
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('Oh no, "entity-inspector" is now deactivated!');
}