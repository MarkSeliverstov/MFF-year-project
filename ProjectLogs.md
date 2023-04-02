# Logs (Diary)

### Usefull links:

- [Vytvoření plaginu](https://code.visualstudio.com/api/get-started/your-first-extension)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

--- 

# Logs of working

### 24.03.2023 | Zahájení projektu

> (?) Jak vytvořit plugin do VSCode. A to včetně případně nějakého využití externího serveru.

#### Vytvoreni

Potrebujeme [Node.js](https://nodejs.org/en), [Yeoman](https://yeoman.io),  [VS Code Extension Generator](https://www.npmjs.com/package/generator-code)

```shell
npm install -g yo generator-code # installing
yo code # create sample
```

```
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

#### Publishing

**Note:** Due to security concerns, vsce will not publish extensions that contain user-provided SVG images.

**Potrebujeme:**
[vsce](https://github.com/microsoft/vscode-vsce) - short for "Visual Studio Code Extensions", is a command-line tool for packaging, publishing and managing VS Code extensions.
`npm install -g @vscode/vsce`

```shell
$ cd myExtension
$ vsce package
# myExtension.vsix generated
$ vsce publish
# <publisherID>.myExtension published to VS Code Marketplace
```

Potom pouzivame Azure pro publishing

---