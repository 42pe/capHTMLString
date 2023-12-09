# capHTMLString

Note: This is a WIP, just a quick package setup for a function I wrote for a separate project. It's not perfect but mostly works.

## Usage

```js

const newHTMLString = capHTMLString(yourHTMLString, cap)

```

Where:

- `cap`: is the number of characters to cap your string to.
- `yourHTMLString`: the string containing HTML you want to cap.

## How it works

The function first parses your string into a div (this is why this only runs on browsers), then goes through all child nodes recursively, checking their character count (ignoring HTML) and capping text ChildNodes when it is necessary, then ignores any subsequent sibling Nodes.