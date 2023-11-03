import * as vscode from 'vscode';
import { AnnotationMarkersConfiguration } from '../configuration';
import { AnnotationReader } from '../exporter';

export class MarkerProvider implements vscode.CompletionItemProvider {
    private anotationConfig: AnotationConfiguration;
    private parser: AnnotationParser;
    constructor(anotationConfig: AnotationConfiguration, parser: AnnotationParser){
        this.anotationConfig = anotationConfig;
        this.parser = parser;
    }

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.CompletionItem[]> {
        const completionItems: vscode.CompletionItem[] = [];

		const line = document.lineAt(position).text.substring(0, position.character);
        console.log(line);
		if (!this.parser.isValidPrefixAnnotationNameInline(line)) {
			return completionItems;
		}

        this.anotationConfig.prefixValues.forEach(prefixVal => {
            completionItems.push(
                new vscode.CompletionItem(prefixVal),
            );
        }); 
		
		return completionItems;
    }
}

export class SuggestionProvider implements vscode.InlineCompletionItemProvider {
    provideInlineCompletionItems(document: vscode.TextDocument, position: vscode.Position): 
    vscode.ProviderResult<vscode.InlineCompletionItem[]> {
        const textBeforeCursor = document.getText(
            new vscode.Range(position.with(undefined, 0), position)
        );
        
        const suggestionItems: vscode.InlineCompletionItem[] = [];
        if (textBeforeCursor.endsWith('mySugg')) {
            suggestionItems.push(
                new vscode.InlineCompletionItem('estion\nThis is the first of sugg.\nyou can change it option + ] or [', new vscode.Range(position, position.translate(0, 10))),
                new vscode.InlineCompletionItem('estion 2\nThis is the second of sugg', new vscode.Range(position, position.translate(0, 10))),
            );
        }
        return suggestionItems;
    }
}
