# Getting started

The **unofficial Iconify CLI** lets you search, preview, and download icons from the Iconify API right from your
terminal. It supports multiple output formats (SVG, JS, Vue, etc.), automatic metadata headers, and flexible file
placement/naming strategies.

## 🧾 Table of Contents

[[TOC]]

## 🧩 Installation

You can install the CLI globally or use it directly via npx:

```shell
# Using npx (recommended for one-time use)
npx iconify-cli@latest <command>

# Or install globally
npm install -g iconify-cli
```

## ⚙️ Configuration

Before downloading icons, initialize a configuration file.
Run this in any project directory:

```shell
iconify config init
```

This creates a file named `.iconify` in your current directory.

**It is recommended but not required, to initialize a configuration file.** If a configuration file is not initialized,
default settings will be used wherever applicable and required options must be passed directly as CLI flag.

Example `.iconify` file

<<< @/../templates/config.ini

### Explanation of fields

| Section    | Key         | Description                                | Default            |
|------------|-------------|--------------------------------------------|--------------------|
| `[api]`    | `host`      | Iconify API hostname.                      | api.iconify.design |
| `[api]`    | `port`      | Port for API requests.                     | 443                |
| `[output]` | `out_dir`   | Output directory for downloaded icons.     | `$CWD`             |
| `[output]` | `placement` | Placement strategy of the downloaded icons | —                  |
| `[output]` | `naming`    | Naming strategy of the downloaded icons    | —                  |
| `[output]` | `template`  | Template used to generate output           | —                  |

> The CLI automatically searches for a `.iconify` config file in the current or parent directories, similar to how npm
> finds package.json.

## 🔍 Searching for Icons

Search for icons by keyword:

```shell
iconify search home
```

Output example:

```text
[Fetch]: Fetch /search
[Info]: Found 999 icons for 'home'

material-symbols:home        material-symbols:home-outline        material-symbols:home-outline-rounded        material-symbols:home-rounded      
material-symbols-light:home  material-symbols-light:home-outline  material-symbols-light:home-outline-rounded  material-symbols-light:home-rounded
ic:baseline-home             ic:outline-home                      ic:round-home                                ic:sharp-home                      
...                          ...                                  ...                                          ...
```

You can also filter for a specific collection.

```shell
iconify search home -p mdi
```

Output example:

```text
[Fetch]: Fetch /search
[Info]: Found 76 icons for 'home'

mdi:home       mdi:home-outline       mdi:home-off           mdi:home-off-outline       
mdi:home-city  mdi:home-city-outline  mdi:home-edit          mdi:home-edit-outline      
mdi:home-lock  mdi:home-plus          mdi:home-plus-outline  mdi:home-roof             
...            ...                    ...                    ...
```

## ⬇️ Downloading Icons

Once you know the icon name (e.g., `mdi:home`), download it using:

```shell
iconify download mdi:home
```

By default, this will:

- Fetch the icon from the Iconify API.
- Generate a file using your selected template.
- Add a comment header containing metadata:
    - Icon name and collection
    - License
    - Version (if available)
    - Author
    - Download time

Example output file (for template `raw`):

```javascript
/*
 * This file was downloaded via the unofficial Iconify CLI v1.0.0
 * 
 * Icon: mdi:home
 * Collection: Material Design Icons
 * License: Apache 2.0 (Apache-2.0)
 * Version: N/A
 * Author: Pictogrammers (https://github.com/Templarian/MaterialDesign)
 * Downloaded: 2025-10-26T14:48:19.373Z
 */

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z"/></svg>`;
export default icon;
```

### Downloading multiple icons

It is possible to download multiple icons at once:

```shell
iconify download mdi:home mdi:person 
```

Also, downloading from different collections is fine:

```shell
iconify download mdi:home mdi:person mdi-light:person
```

::: warning
The CLI doesn't check for the local existence of an icon.

When running following command with the `flat` placement strategy, the second Icon will override the first one because
they result to the same name.

````shell
iconify download mdi:person mdi-light:person
 ````

The same result applies, when downloading separately.

````shell
iconify download mdi:person
iconify download mdi-light:person
 ````

:::

## 🧱 Output Structure

The output file placement depends on your `placement` and `naming` strategy.

### Naming

| Input                | Strategy | Output           |
|----------------------|----------|------------------|
| `mdi:person-outline` | `lower`  | `personoutline`  |
| `mdi:person-outline` | `upper`  | `PERSONOUTLINE`  |
| `mdi:person-outline` | `camel`  | `personOutline`  |
| `mdi:person-outline` | `pascal` | `PersonOutline`  |
| `mdi:person-outline` | `kebab`  | `person-outline` |

### Placement

The placement strategies defines how the downloaded icons are stored in your output directory.

For the placement, the naming strategy `pascal` and the template `raw` is used.

| Input                | Strategy   | Output                          |
|----------------------|------------|---------------------------------|
| `mdi:person-outline` | `flat`     | `$OUT_DIR/PersonOutline.js`     |
| `mdi:person-outline` | `prefixed` | `$OUT_DIR/MdiPersonOutline.js`  |
| `mdi:person-outline` | `grouped`  | `$OUT_DIR/mdi/PersonOutline.js` |

::: info
`grouped` is the **recommendation** when working with multiple icons sets.

When running the following command:

```shell
iconify download mdi:person mdi:person-outline mdi:home mdi-light:person mdi-light:alert -t raw -p grouped -n pascal
```

`iconify` will generate the following folder structure:

```text
$OUT_DIR
├── mdi
│   ├── Person.js
│   ├── PersonOutline.js
│   └── Home.js
└── mdi-light
    ├── Alert.js
    └── Person.js
```

:::

## 🧪 Precedence of options

The order of options is simple: **CLI flags** have the highest priority and will override everything else. Next, the
**settings in the configuration file** are applied. If an option isn't provided in either of these, it will fall back to
the **default values**, if they exist. If no default exists, the value must either be passed as a **CLI flag** or
defined in the **settings file** to make the command work.

## 🧾 Templates

### `svg`

Downloads the icon as a raw svg file

<<< @/../templates/svg.txt

### `raw`

Downloads the icon as a raw ESM JavaScript module

<<< @/../templates/raw.js

### `raw-ts`

Downloads the icon as a raw ESM TypeScript module

<<< @/../templates/raw-ts.ts

### `vue`

Downloads the icon as a Vue.js component

<<< @/../templates/vue.vue

### Missing a template?

If you miss a template, feel free to open an [issue](https://github.com/bytelab-studio/iconify-cli/issues) or directly submit a [PR](https://github.com/bytelab-studio/iconify-cli/pulls) with the new template