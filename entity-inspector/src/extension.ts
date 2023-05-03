import * as vscode from 'vscode';
import * as parser from './parser';
import * as Providers from './providers';

export class MyDiagnostic{
	static diagnosticCollection = vscode.languages.createDiagnosticCollection('myDiagnostics');
}

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

	//let cache : EIClass[] = [];
	console.log('Congratulations, your extension "entity-inspector" is now active!');
	addDiagnostic(MyDiagnostic.diagnosticCollection);

	console.log('adding completion items provider');
	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider(
			{pattern: "**"}, // all files
			new Providers.MarkerProvider()),
			
		vscode.languages.registerInlineCompletionItemProvider(
			{pattern: "**"},
			new Providers.SuggestionProvider()),
	);

	vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
		console.log(`File saved: ${document.uri.fsPath}`);
		parser.getEntitiesFromFile(document);
	});
}

/*
 * TODO: Add memization of entityes from workspace
 */
function memorizeEntityesFromWorkspace() : void {
	// Listen for file save events
	vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
		console.log(`File saved: ${document.uri.fsPath}`);
	});

	// Listen for file delete events
	vscode.workspace.onDidDeleteFiles((event: vscode.FileDeleteEvent) => {
		console.log(`File deleted: ${event.files[0].fsPath}`);
	});
	
	// Listen for file create events
	vscode.workspace.onDidCreateFiles((event: vscode.FileCreateEvent) => {
		console.log(`File created: ${event.files[0].fsPath}`);
	});
}

// Diagnostic of errors, warnings, infos and hints
function addDiagnostic(diagnosticCollection: vscode.DiagnosticCollection) {
	console.log('adding diagnostic');
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
export function deactivate() {}