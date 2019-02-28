# Notes

- https://github.com/styled-components/vscode-styled-components
- https://code.visualstudio.com/api/extension-guides/webview
- https://code.visualstudio.com/api/references/vscode-api#workspace.createFileSystemWatcher
- https://beta.observablehq.com/@jashkenas/earthquakes
- https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
- https://code.visualstudio.com/api/extension-guides/overview
- https://github.com/observablehq/runtime
- https://github.com/observablehq/parser
- https://dsherret.github.io/ts-morph/


Given a notebook URL:

- change "beta" to "api" and add ".js" on the end
- append "?v=3" to get a different version (newer? older?)
- append "?module". not sure what that does, if anything


## Requirements

- Write code in typescript
  - To what extent do I allow/emulate the quirks of the observable language? vs. just do plain typescript?
- Live(-ish) display of result
  - really live? or on shift-enter?

## Secondary Requirements / Nice-to-haves

- Debug
- Markdown / HTML / etc sections
  - Use special comment-syntax instead of backticks
- Import / Export
  - Open from URL
    - translate to TS at all? (hard?)
  - Upload to Observable? (API?)
    - account / login?
- Configurable hide/show of code?
  - By default, just show the results
- Export to HTML
  - Blogging platform?
- Security
  - CSP such that importing from an untrusted URL is OK

## Questions, Unknowns

- 
