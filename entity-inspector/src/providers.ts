import * as vscode from 'vscode';

export class MarkerProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.CompletionItem[]> {
        const triggerSuffix = '@ei-';
        let completionItems: vscode.CompletionItem[] = [];

        // Check if the line starts with the trigger suffix
		const linePrefix = document.lineAt(position).text.substring(0, position.character);
		if (!linePrefix.endsWith(triggerSuffix)) {
			console.log("Unknown prefix: " + linePrefix);
			return completionItems;
		}
		console.log("Known prefix: " + linePrefix);

		// Add basic completion items for all languages
		completionItems.push(
			new vscode.CompletionItem('class:'),
			new vscode.CompletionItem('propetry:'),
			new vscode.CompletionItem('method:'),
            new vscode.CompletionItem('description:'),
		);
		
		return completionItems;
    }
}

export class SuggestionProvider implements vscode.InlineCompletionItemProvider {
    provideInlineCompletionItems(document: vscode.TextDocument, position: vscode.Position): 
    vscode.ProviderResult<vscode.InlineCompletionItem[]> {
        const textBeforeCursor = document.getText(
            new vscode.Range(position.with(undefined, 0), position)
        );
        
        let suggestionItems: vscode.InlineCompletionItem[] = [];
        if (textBeforeCursor.endsWith('mySugg')) {
            suggestionItems.push(
                new vscode.InlineCompletionItem('estion\nThis is the first of sugg.\nyou can change it option + ] or [', new vscode.Range(position, position.translate(0, 10))),
                new vscode.InlineCompletionItem('estion 2\nThis is the second of sugg', new vscode.Range(position, position.translate(0, 10))),
            );
        }
        return suggestionItems;
    }
}
