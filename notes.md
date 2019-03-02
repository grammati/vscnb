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

- How important is it that the notebook file be valid Typescript?
  - Advantages:
    - Can run, import to reuse, copy/paste code, etc.
    - Get syntax highlighting and error-markers for free
    - Better chance of figuring out how to debug, without having to generate source maps
  - Disadvantages
    - Doesn't look quite like the code in a real observable notebook
    - Need to transform code upon import from obs
    - Tricky semantics around promises, generators
    - Can't have markdown sections, html sections, etc (need to keep using backticks)

## Options / Incremental Steps

- Make a file type that is just ojs (observable-js, their dialect), split by magic comments ("//%%")
  - Simplest possible implementation (that I can think of)
  - Split and pass to webview
  - Have to eval on webview side, I think (postMessage payload must be serializable, not functions)
  - Will have syntax errors if treated as js
    - How hard is it to write a syntax? Is it worth it?
- Make a file type that is valid Typescript, split by magic comments
  - Have to manually wrap code in extra stuff to make it valid
  - Compile to js, split compiled code, then proceed as above
  - Need to unwrap on webview side? Not sure.
- Ultimate goal:
  - Looks like ojs with types
  - Syntax-highlighted and error-checked by vscode as typescript (how? not sure)
  - Markdown sections, etc ("//%% md"), properly highlighted
  - Debuggable (hard! I think. Will run in webview - cannot debug webview except with special tool. Run in phantomjs?)

