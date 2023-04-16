import * as vscode from 'vscode';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "entity-inspector" is now active!');
	console.log('adding completion items...');
	context.subscriptions.push(myRegisterCompletionItemProvider());
}

/*
 * Register a completion item provider for the current workspace for any languages
 */
function myRegisterCompletionItemProvider(): vscode.Disposable {
	const triggerSuffix = '@ei-';
	const documentSelector = { scheme: 'file', language: '*' };
	const _provideCompletionItems = {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
		const completionItems: vscode.CompletionItem[] = [];
		
		// Check if the line starts with the trigger suffix
		const linePrefix = document.lineAt(position).text.substring(0, position.character);
		if (!linePrefix.endsWith(triggerSuffix)) {
			console.log("Unknown prefix: " + linePrefix);
			return completionItems;
		}
		console.log("Known prefix: " + linePrefix);

		// Add basic completion items for all languages
		completionItems.push(
			new vscode.CompletionItem('class'),
			new vscode.CompletionItem('atribute'),
			new vscode.CompletionItem('method'),
		);
		
		return completionItems;
		}
	};
	return vscode.languages.registerCompletionItemProvider(documentSelector, _provideCompletionItems);
}

/*
 * TODO: Add entityes from a workspace to the completion items
 */
function addEntityesFromWorkspace(completionItems: vscode.CompletionItem[], workspace: string) {
	const parser = require('./parser');
	let rootDirectory = vscode.workspace.rootPath;

	parser.findEntityesInDir(rootDirectory);

	// Listen for file save events
	vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
		console.log(`File saved: ${document.uri.fsPath}`);
		parser.findEntityesInFile(document.uri.fsPath);
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

/*
 * TODO: Register a completion item provider for the current workspace for entityes
 */
function myRegisterHoverProvider(): vscode.Disposable { return new vscode.Disposable(() => {});}

// This method is called when your extension is deactivated
export function deactivate() {}
