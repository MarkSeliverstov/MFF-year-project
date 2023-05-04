import * as vscode from 'vscode';

export class EIClass {
	name: string;
	fromFile: vscode.Uri;

	// name of the atributes and methods
	atributes: string[];
	methods: string[];

	constructor(name: string, fromFile: vscode.Uri) {
		this.name = name;
		this.fromFile = fromFile;
		this.atributes = [];
		this.methods = [];
	}
}

