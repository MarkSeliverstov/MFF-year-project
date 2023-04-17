# Diary of the project

### Usefull links:

- [Create plugin](https://code.visualstudio.com/api/get-started/your-first-extension)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [VSCode API](https://code.visualstudio.com/api)

# 24.03.2023 | Zahájení projektu

> (?) How to create plugin for VSCode. And with using external server.

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
> - marking of classes, functions, and variables
> - showing of information about marked element
> - hints when identifying existing entities (maybe auto-writing like in Copilot)

- I came up with a name the extension: `Entity-Inspector`

## Marking

I used special syntax for marking elements of entityes `@ei-<type>` in comments.

<img src="assets/marking.gif" alt="Marking using Ctrl+Space " width="500" />

### Hints and completion items when identifying existing entities

> Vscode has an [API](https://code.visualstudio.com/api) for creating plugins.
> I used [registerCompletionItemProvider](https://code.visualstudio.com/api/references/vscode-api#languages.registerCompletionItemProvider)

```ts
registerDocumentFormattingEditProvider (
    selector: DocumentSelector,
    provider: DocumentFormattingEditProvider): Disposable
```

This method is called when the user types a character or presses `Ctrl+Space` in the editor. The method should return a list of completion items, a [CompletionList](https://code.visualstudio.com/api/references/vscode-api#CompletionList). The lack of a result can be signaled by returning `undefined`, `null`, or an empty array.

_The method takes 3 arguments:_

- `selector` - is a [DocumentSelector](https://code.visualstudio.com/api/references/vscode-api#DocumentSelector) which is either a [language id](https://code.visualstudio.com/api/references/vscode-api#languages.getLanguages), like `javascript`, or a more complex [filter](https://code.visualstudio.com/api/references/vscode-api#DocumentFilter) like `{ language: 'typescript', scheme: 'file' }`.

- `provider` - An object that implements [completion item provider](https://code.visualstudio.com/api/references/vscode-api#CompletionItemProvider) interface.

- `triggerCharacters` - An optional array of characters that when pressed while typing should trigger completion.

_Note:_ I used:`{ scheme: 'file', language: '*' }` selector for select all files and all languages. And I used `triggerCharacters` for `@ei-` prefix.

## Showing information about marked element

TODO:

May be I can using [registerHoverProvider](https://code.visualstudio.com/api/references/vscode-api#languages.registerHoverProvider) for showing information about marked element.
