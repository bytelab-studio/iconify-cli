# Programmatic Usage

The **Iconify CLI library** can also be used directly as an npm dependency, allowing you to integrate search, download,
and template generation features into your own build scripts or tools.

## 📦 Installation

Install the package locally:

```shell
npm install iconify-cli
```

## 🔧 Importing the Library

You can import the exported functions directly from the main module.
All exports are fully typed (via TypeScript definitions).

```typescript
import {api, Config} from "iconify-cli";
```

## 🧩 Basic Example

```typescript
import {api, templates, applyTemplate, Config} from "iconify-cli";

// Using default config
const config: Config = new Config();

// Get collection information
const collections = await api.getCollections(config, ["mdi"]);
const collection = collections.mdi;

// Returns the raw svg string
const svg: string = await api.downloadIcon(config, "mdi", "home");

// Wraps the svg into a Vue.js template
const template: string = applyTemplate("vue", "mdi", "home", collection, svg);

// Do something with the template
console.log(template);
```

## 🧠 TypeDoc Reference

All exported classes and functions are documented automatically in the generated [API Reference](/api/).