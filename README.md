# ksp-table

- use [pnpm](https://pnpm.io/)

## Installation

`pnpm i`

## Development

`pnpm dev`

### Git Hooks Setup

This project uses [Husky](https://typicode.github.io/husky/) for Git hooks to ensure code quality.

**Automatic Setup:**
```bash
pnpm install  # Automatically sets up Husky
```

**Manual Setup (if needed):**
```bash
pnpm run setup-hooks  # Creates pre-commit hooks
```

**What the hooks do:**
- **Pre-commit**: Runs tests and linting before allowing commits
- Ensures code passes `pnpm test` and `pnpm run pre-commit` (ESLint with auto-fix)

**Note**: Git hooks are created locally and not tracked in the repository, allowing developers flexibility across different operating systems.

<hr>
<hr>
<h1 style="font-size: 2rem">Original Repository</h1>


# simple-datatables

A lightweight, extendable, JavaScript HTML table library written in TypeScript and transpilled to Vanilla JavaScript. Similar to jQuery DataTables **for use in modern browsers**, but without the jQuery dependency.

## Examples / Demos

See the demos [here](https://fiduswriter.github.io/simple-datatables/demos/) and the documentation [here](https://fiduswriter.github.io/simple-datatables/documentation/).

### Upgrading

For upgrading from one major version to another, check the upgrade guide:
https://fiduswriter.github.io/simple-datatables/documentation/Upgrading

**Note**: The upgrade from version 5 version 6 is the most complicated upgrade so far. Please read through the instructions before filing complaints. If you run simple-datatables from a CDN, make sure that you have fixed it to a specific major or minor version so that you do not accidentally upload to a new version that requires you to do lots of manual adjustments.


# CDN

To use the CDN version of simple-datatables use either [https://cdn.jsdelivr.net/npm/simple-datatables@latest](https://cdn.jsdelivr.net/npm/simple-datatables@latest) or [https://unpkg.com/simple-datatables](https://unpkg.com/simple-datatables). You also need to add the CSS styling, so the elements you'll add to html head element can for example be these:

**Note:** For production websites, specify a specific major version. For example [https://cdn.jsdelivr.net/npm/simple-datatables@6](https://cdn.jsdelivr.net/npm/simple-datatables@6) for the latest version in the 6.x.x series or [https://cdn.jsdelivr.net/npm/simple-datatables@6.0](https://cdn.jsdelivr.net/npm/simple-datatables@6.0) for the latest version in the 6.0.x series.

```html
<link href="https://cdn.jsdelivr.net/npm/simple-datatables@latest/dist/style.css" rel="stylesheet" type="text/css">
<script src="https://cdn.jsdelivr.net/npm/simple-datatables@latest" type="text/javascript"></script>
```
### License

LGPL

### Features

* Sortable/filterable columns
* Pagination
* Searchable
* Customisable layout
* Customisable labels
* Customise column rendering
* Export to common formats like `csv`, `txt`, `json`, and `sql`
* Import `csv` and `json` data
* Control column visibility
* Reorder or swap columns
* dayjs integration for sorting columns with datetime strings
* Using [diffDOM](https://github.com/fiduswriter/diffDOM) for faster DOM updates.


[simple-datatables Documentation](https://fiduswriter.github.io/simple-datatables/documentation)


### History

This project started as a fork of [Vanilla-DataTables](https://github.com/Mobius1/Vanilla-DataTables), but it has since been converted to TypeScript.

If you want a version that works in very old browsers (IE, etc.), then head over to https://github.com/fiduswriter/simple-datatables-classic .


---


### Install

## npm
```
npm install simple-datatables --save
```
## Yarn
```
yarn add simple-datatables
```

---

### Quick Start

Then just initialise the plugin by import DataTable and either passing a reference to the table or a CSS3 selector string as the first parameter:

```javascript
import {DataTable} from "simple-datatables"

const myTable = document.querySelector("#myTable");
const dataTable = new DataTable(myTable);

// or

const dataTable = new DataTable("#myTable");

```

You can also pass the options object as the second parameter:

```javascript
import {DataTable} from "simple-datatables"

const dataTable = new DataTable("#myTable", {
	searchable: false,
	fixedHeight: true,
	...
})
```

If using the CDN:

```javascript
const dataTable = new simpleDatatables.DataTable("#myTable", {
	searchable: false,
	fixedHeight: true,
	...
})
```

---

## How to contribute?

1. Fork the repository
2. Create a sub-branch
3. Clone the sub-branch to your local system
4. Install [NodeJS](https://nodejs.org/en) and [pnpm](https://pnpm.io/)
5. Open the project in a code editor (for example [Visual Studio Code](https://code.visualstudio.com/) or [Pulsar Edit](https://pulsar-edit.dev/))
6. Open the Terminal
7. Run `pnpm install` in the Terminal (this automatically sets up Husky git hooks)
8. **Optional**: Run `pnpm run setup-hooks` if you want to set up pre-commit hooks manually
9. Start making changes and contributing to the project 🙂

### Development Commands

- **`pnpm run dev`** - Full development environment (test server + build watcher + TypeScript checker)
- **`pnpm run test_server`** - Test server only (runs on port 3000: http://localhost:3000/)
- **`pnpm run typecheck:watch`** - TypeScript checker in watch mode
- **`pnpm run build_js:watch`** - Build watcher only
- **`pnpm run build`** - Build final files for production

### Code Quality

The project enforces code quality through:
- **TypeScript**: Type checking with `pnpm run typecheck`
- **ESLint**: Linting with `pnpm run lint`
- **Pre-commit hooks**: Automatic testing and linting before commits
- **Tests**: Run with `pnpm test`

10. Once finished, commit/push your code and create a Pull Request on GitHub for the changes

**Note**: The pre-commit hook will automatically run tests and fix linting issues before allowing commits.
