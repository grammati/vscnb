import * as ts from "typescript";
import * as vscode from "vscode";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "observable.openNotebook",
    ObservableNotebookPanel.createOrShow
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

class ObservableNotebookPanel {
  public static currentPanel?: ObservableNotebookPanel;

  public static readonly viewType = "observable.Notebook";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _editor: vscode.TextEditor;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(): void {
    console.log("createOrShow");
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No editor is open");
    } else {
      const panel = vscode.window.createWebviewPanel(
        ObservableNotebookPanel.viewType,
        "Observable Notebook",
        {
          viewColumn: vscode.ViewColumn.Beside,
          preserveFocus: true
        },
        {
          // Enable javascript in the webview
          enableScripts: true
        }
      );

      ObservableNotebookPanel.currentPanel = new ObservableNotebookPanel(
        panel,
        editor
      );
    }
  }

  n: number;
  constructor(panel: vscode.WebviewPanel, editor: vscode.TextEditor) {
    this._panel = panel;
    this._editor = editor;
    this.n = 1;

    // Set the webview's initial html content
    this._update();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case "alert":
            vscode.window.showErrorMessage(message.text);
            return;
        }
      },
      null,
      this._disposables
    );

    vscode.workspace.onDidChangeTextDocument(
      event => {
        if (this.isPreviewOf(event.document.uri)) {
          this._update();
        }
      },
      null,
      this._disposables
    );
  }

  private isPreviewOf(resource: vscode.Uri): boolean {
    return this._editor.document.uri.fsPath === resource.fsPath;
  }

  private _update(): void {
    this.n += 1;

    const source = this._editor.document.getText();
    const cells = source.split(/\/\/%%[^\n]*\n/).map(s => s.trim).filter(s => s);
    console.log(cells);

    // let result = ts.transpileModule(source, {
    //   compilerOptions: { module: ts.ModuleKind.CommonJS }
    // });
    // console.log(JSON.stringify(result));

    this._panel.webview.html = this._getHtmlForWebview(cells);
  }

  private _getHtmlForWebview(cells: string[]) {
    // Local path to main script run in the webview
    const t = this._editor.document.getText();
    const runtimeSrc = vscode.Uri.file(
      path.join(
        __dirname,
        "../node_modules/@observablehq/runtime/dist",
        "runtime.umd.js"
      )
    ).with({ scheme: "vscode-resource" });

    return `<!DOCTYPE html>
    <meta charset="utf-8">
    <title>Earthquakes!</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/@observablehq/notebook-inspector@1/dist/notebook-inspector-style.css">
    <body>
    <h1>Hello</h1>
    <div id='content'>1</div>
    <div id='content2'>2</div>
    <script type="module">
    
    import {Runtime,Inspector} from "https://unpkg.com/@observablehq/runtime@3/dist/runtime.js";
    import hello from "https://api.observablehq.com/@tmcw/hello-world.js?v=3";
    console.log(hello);
    
    const notebook = {
      id: 'kljdflakdl',
      modules: [{
        id: 'oefdlkfadlfa',
        variables: [{
          name: 'x',
          value: () => 23
        }, {
          name: 'y',
          inputs: ['x'],
          value: (x) => x * 2
        }]
      }]
    }

    const runtime = new Runtime();
    //const mainModule = runtime.module(notebook, Inspector.into(document.querySelector('#content')));
    const helloModule = runtime.module(hello, Inspector.into(document.querySelector('#content2')));
    
    </script>`;
  }

  public dispose() {
    ObservableNotebookPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}
