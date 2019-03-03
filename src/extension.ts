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

  private readonly panel: vscode.WebviewPanel;
  private readonly editor: vscode.TextEditor;
  private disposables: vscode.Disposable[] = [];

  public static createOrShow(): void {
    console.log("createOrShow");
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No editor is open"); // TODO: create one
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

      // TODO: allow more than one
      ObservableNotebookPanel.currentPanel = new ObservableNotebookPanel(
        panel,
        editor
      );
    }
  }

  constructor(panel: vscode.WebviewPanel, editor: vscode.TextEditor) {
    this.panel = panel;
    this.editor = editor;

    // Set the webview's initial html content
    this.renderNotebook();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

    // Handle messages from the webview
    this.panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case "alert":
            vscode.window.showErrorMessage(message.text);
            return;
        }
      },
      null,
      this.disposables
    );

    vscode.workspace.onDidChangeTextDocument(
      event => {
        if (this.isPreviewOf(event.document.uri)) {
          this.update();
        }
      },
      null,
      this.disposables
    );
  }

  private isPreviewOf(resource: vscode.Uri): boolean {
    return this.editor.document.uri.fsPath === resource.fsPath;
  }

  private update(): void {
    const source = this.editor.document.getText();
    const cells = source
      .split(/\/\/%%[^\n]*\n/)
      .map(s => s.trim())
      .filter(s => s);
    console.log(cells);

    // let result = ts.transpileModule(source, {
    //   compilerOptions: { module: ts.ModuleKind.CommonJS }
    // });
    // console.log(JSON.stringify(result));

    this.panel.webview.postMessage({
      type: 'notebook.update',
      payload: {
        cells
      }
    });
  }

  private renderNotebook() {
    this.panel.webview.html = this.getNotebookHtml();
  }

  private getNotebookHtml() {
    const scriptSrc = vscode.Uri.file(
      path.join(__dirname, "../media", "notebook.js")
    ).with({ scheme: "vscode-resource" });

    return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Earthquakes!</title>
      <link rel="stylesheet" type="text/css" href="https://unpkg.com/@observablehq/notebook-inspector@1/dist/notebook-inspector-style.css">
      </head>
      <body>
        <div id='content'></div>
        <script src="${scriptSrc}"></script>
      </body>
    </html>
    `;
  }

  public dispose() {
    ObservableNotebookPanel.currentPanel = undefined;

    // Clean up our resources
    this.panel.dispose();

    while (this.disposables.length) {
      const x = this.disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}
