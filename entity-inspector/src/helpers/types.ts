export class EIClass {
	name: string;
	
	// fromFile: string;
	description: string;
	properties: EIPropetry[];
	methods: EIMethod[];

	constructor(name: string, description: string = "", properties: EIPropetry[] = [], methods: EIMethod[] = []) {
		this.name = name;
		this.description = description;
		this.properties = properties;
		this.methods = methods;
	}
}

export class EIPropetry {
	name: string;
	description: string;

	constructor(name: string, description: string = "") {
		this.name = name;
		this.description = description;
	}
}

export class EIMethod {
	name: string;
	description: string;

	constructor(name: string, description: string = "") {
		this.name = name;
		this.description = description;
	}
}
