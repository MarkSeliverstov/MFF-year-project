import * as vscode from 'vscode';

export class EIClass {
	fromFile: vscode.Uri;

	name: string;
	description: string;
	properties: EIPropetry[];
	methods: EIMethod[];

	constructor(name: string, fromFile: vscode.Uri) {
		this.fromFile = fromFile;
		this.name = name;
		this.description = "";
		this.properties = [];
		this.methods = [];
	}
}

export class EIPropetry {
	name: string;
	type: string;
	defaultVal: string;
	description: string;

	constructor(name: string, type: string = "string", defaultVal: string = "default", description: string = "") {
		this.name = name;
		this.type = type;
		this.defaultVal = defaultVal;
		this.description = description;
	}
}

export class EIMethod {
	name: string;
	description: string;

	constructor(name: string, description: string) {
		this.name = name;
		this.description = description;
	}
}
