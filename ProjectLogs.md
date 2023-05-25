# Diary of the project

### Usefull links:

- [VSCode Extension Generator](https://www.npmjs.com/package/generator-code)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [VSCode API](https://code.visualstudio.com/api)
- [Examples of using VSCode API](https://github.com/microsoft/vscode-extension-samples)
- [Škoda Petr](https://skodapetr.github.io/)
- [Example of BACHELOR THESIS](https://dspace.cuni.cz/bitstream/handle/20.500.11956/174168/130333096.pdf?sequence=1&isAllowed=y)

# 24.03.2023 | Start of the project

> How to create plugin for VSCode? And with using external server for getting information about entities.

## Creating plugin

We need [Node.js](https://nodejs.org/en), [Yeoman](https://yeoman.io), [VS Code Extension Generator](https://www.npmjs.com/package/generator-code)

```shell
npm install -g yo generator-code # installing
yo code # create sample
```

```
Structure of the project:
.
├── .vscode
│   ├── launch.json     // Config for launching and debugging the extension
│   └── tasks.json      // Config for build task that compiles TypeScript
├── .gitignore          // Ignore build output and node_modules
├── README.md           // Readable description of your extension's functionality
├── src
│   └── extension.ts    // Extension source code
├── test                // Extension tests
├── package.json        // Extension manifest
├── tsconfig.json       // TypeScript configuration
```

## Publishing

**Note:** Due to security concerns, vsce will not publish extensions that contain user-provided SVG images.

**Requirements:**
[vsce](https://github.com/microsoft/vscode-vsce) - short for "Visual Studio Code Extensions", is a command-line tool for packaging, publishing and managing VS Code extensions.
`npm install -g @vscode/vsce`

```shell
$ cd myExtension
$ vsce package # myExtension.vsix generated
$ vsce publish # <publisherID>.myExtension published to VS Code Marketplace

```

# 12.04.2023 | Basic functionality for plugin

> **Do basic functionality for plugin suppotring:**
>
> - marking of classes, methods, and atributes
> - suggesting/hints when identifying existing entities (maybe auto-writing like in Copilot)
> - showing of information about marked element
> - showing errors

- I came up with a name the extension: `Entity-Inspector`

## Implementaion

### General information

Vscode has an [API](https://code.visualstudio.com/api) for creating plugins. <br>
There are 2 ways to implement the functionality of the plugin: [Language Server](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide) and [Language Features](https://code.visualstudio.com/api/language-extensions/language-features). <br>
I used the second way, because it is easier to implement and it is enough for my task.

Also there is usefull link to examples of using VSCode API: [vscode-extension-samples](https://github.com/microsoft/vscode-extension-samples)

I used _register provider_ methods for implementing functionality:

`registerCompletionItemProvider` - for marking elements of entityes <br>
`registerInlineCompletionItemProvider` - for suggesting/hints when identifying existing entities (maybe auto-writing like in Copilot) <br>
`registerHoverProvider` - for showing of information about marked element <br>
`diagnosticCollection` - for showing errors

Each of this methods takes 2 main arguments:

- `selector` - is a [DocumentSelector](https://code.visualstudio.com/api/references/vscode-api#DocumentSelector) which is either a [language id](https://code.visualstudio.com/api/references/vscode-api#languages.getLanguages), like `javascript`, or a more complex [filter](https://code.visualstudio.com/api/references/vscode-api#DocumentFilter) like `{ language: 'typescript', scheme: 'file' }`.

- `provider` - An object that implements [completion item provider](https://code.visualstudio.com/api/references/vscode-api#CompletionItemProvider) interface.

---

### Marking (Ctrl+Space)

<img src="assets/marking.gif" alt="Marking using Ctrl+Space " width="500" />

I used special syntax for marking elements of entityes `@ei-<type>` in comments.

I used `registerCompletionItemProvider` for marking elements of entityes:

- This method is called when the user **types a character or presses `Ctrl+Space`** in the editor.
- The method should return a list of completion items ([CompletionList](https://code.visualstudio.com/api/references/vscode-api#CompletionList))
- Completion items are presented in the IntelliSense UI. Depending on the [kind](https://code.visualstudio.com/api/references/vscode-api#CompletionItemKind) of completion item, VS Code shows icon and/or text.
  - The `label` property is mandatory. It is presented in the IntelliSense UI and can be used to filter the list of completion items.
  - The `insertText` property is optional. If it is omitted, the `label` is inserted. If it is set to `null`, nothing is inserted when the completion item is accepted.
  - The `documentation` property is optional. It is shown in the IntelliSense UI when hovering over the completion item.
  - The `kind` property is optional. It is used to set the icon in the IntelliSense UI.

```ts
registerCompletionItemProvider (
    selector: DocumentSelector, // where to use this provider
    provider: DocumentFormattingEditProvider // what to do when provider is called
    triggerCharacters?: string[] // when to call provider (optional)
    ): Disposable
```

_Note:_ I used:`{pattern: "**"}` for _selector_ and `@ei-` for _triggerCharacters_ for using this provider in all files and for calling it when user press `Ctrl+Space`.

### Suggesting/hints when identifying existing entities

<img src="assets/suggesting.gif" alt="Suggesting/hints when identifying existing entities" width="500" />

I found existing example of using this functionality in some open source project: [copilot-clone](https://github.com/hieunc229/copilot-clone/blob/master/src/extension.ts)

I used `registerInlineCompletionItemProvider` for suggesting/hints when identifying existing entities:

- This method works same as `registerCompletionItemProvider` but it is called when the user **types a character** in the editor and it is used for **inline** completion - when the user is typing and the editor is showing suggestions at the cursor.

```ts
registerInlineCompletionItemProvider (
    selector: DocumentSelector, // where to use this provider
    provider: DocumentFormattingEditProvider // what to do when provider is called
    triggerCharacters?: string[] // when to call provider (optional)
    ): Disposable
```

### Showing of information about marked element

We can use `registerHoverProvider` for showing of information about marked element:

- This method is called when the user **hovers over a symbol** in the editor.
- The method should return a [hover](https://code.visualstudio.com/api/references/vscode-api#Hover) or a [thenable](https://code.visualstudio.com/api/references/vscode-api#Thenable) that resolves to such.

```ts
registerHoverProvider (
    selector: DocumentSelector, // where to use this provider
    provider: DocumentFormattingEditProvider // what to do when provider is called
    ): Disposable
```

### Showing errors

<img src="assets/errors.gif" alt="Showing errors" width="500" />

I used `diagnosticCollection` for showing errors. That is a collection of diagnostics, such as errors or warnings, that belong to a source. <br>

# 26.04.2023 | Fetching, memorization, motivation

> - I will think about how to fetch data from server in extension and how to show it to user. <br>
> - I need to do data memorization <br>
> - I will think about what motivates me to do this plugin.<br>
> - I have to finish the previous tasks

### Fetching data from server

I think that I will use [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) for fetching data from server. <br>

```ts
// This is an example of using fetch
fetch("https://api.github.com/users/github")
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### Data memorization

I think that I _parse_ data from workspace and I will memorize it in cache like `Map<string, EIClass>` where `string` is a path to file and `EIClass` is a class that contains information about entity. <br>
Also we can memorize data in file, but I think that it is not a good idea, becouse we don't wont to create files in workspace.

```ts
class EIClass {
  name: string;
  fromFile: vscode.Uri;
  // name of the atributes and methods
  atributes: string[];
  methods: string[];
}
```

### Motivation

Firstly, as software developers, our main goal is to write code efficiently. We spend a lot of time reading, analyzing, and understanding code, and this can be a daunting task, especially when we are dealing with large codebases. The Entity Inspector extension aims to simplify this process by allowing developers to see all the entities in one place, making it easier to navigate through the codebase and find the information they need faster.

Secondly, the Entity Inspector extension provides a convenient way to manage entities. It enables developers to automatically generate an entity if they already have one in their code, saving them time and effort. Additionally, the plugin can hint about existing entities, making it easier to reuse code and avoid duplicating work.

Finally, the Entity Inspector extension promotes organization in code. It allows developers to see all the information about an entity in one place, making it easier to understand its purpose and function. This can lead to more maintainable code and better collaboration among team members.

In summary, the Entity Inspector extension for VSCode provides an efficient, convenient, and organized way to manage entities in code, ultimately making the development process smoother and more productive.

> TODO: Think about vscode configs and how to use them in extension.

# 17.05.2023 | Model and use cases of extension

<img src="assets/model.jpeg" alt="Model and use cases of EI" width="500" />

### Creating a model of EI
```mermaid
flowchart LR
	subgraph Project
		Java -.similar entities.- HTML
		HTML -.similar entities.- SQL
		SQL -.similar entities.- Documentation
		Documentation -.similar entities.- JSON
	end
	Extrakce((Extrakce))
	Java --> Extrakce
	HTML --> Extrakce
	SQL --> Extrakce
	Documentation --> Extrakce
	JSON --> Extrakce
	subgraph Model
		EI-Java
		EI-HTML
		EI-SQL
		EI-Documentaion
		EI-JSON
	end
	Extrakce --> EI-Java
	Extrakce --> EI-HTML
	Extrakce --> EI-SQL
	Extrakce --> EI-Documentaion
	Extrakce --> EI-JSON
	Model <==> Scheme_in/out
```

Some example of modeling data: [LinkML - Linked data Modeling Language (model your dana)](https://linkml.io/)

**There are 2 ways how to create a model of EI:** <br>
	1. Parse project and create small (?)files with only with entities. After that create a model of EI by comparing small files (and you can also create a scheme of Entities) <br>
	2. Upload a scheme and create a model of EI

### Use cases

1. Comparing & validating (somewhere something is missing, something needs to be removed, something added)
2. Help when writing annotations (**static** like lince or **dynamic** like copilot using a model of EI)
3. Import/export existing entities (from another project(server) or from scheme)
4. Browser for entities in vscode like a preview of .md files (searching, filtering, sorting, grouping, etc.)
5. Generating code ([generating code with linkML](https://linkml.io/linkml/generators/index.html))
	- Synhronization of entities (from project or from scheme and define there is a genetaion of code)
6. Help with CI/CD github actions (for example: check if there is a new version of scheme and if yes, then generate code)

> TODOs for this weeks:
> - TODO: Start writing Bachelor Thesis (related work):
> 	- Are there any similar extensions? If yes, what are they doing? What are their advantages and disadvantages? Comparing with some code helpers (copilot, lince, etc.), with ChatGPT. Compare with other tools for creating models (LinkML, etc.).


# 24.05.2023 |