# `iconify download <icon>`

Download one or more icons

## 🔧 Options

Flag              | Description
------------------------|----------------------------------------------------------------
`-t=` \| `--template=`  | Downloads the icon in a specific template
`-p=` \| `--placement=` | Saves the downloaded icons with the defined strategy
`-n=` \| `--naming=`    | Generates the filname based on the defined strategy
`--config-host=`        | Overrides the target api hostname
`--config-port=`        | Overrides the target api port
`-h` \| `--help`        | Prints a help text

## ⚙️ Programatic example

### Minimal example

```typescript
import {Config, api} from "iconify-cli";

const config: Config = new Config();

const svg: string = await api.downloadIcon(config, "mdi", "home");
```

### Apply a template

```typescript
import {Config, api, applyTemplate, templates} from "iconify-cli";

const prefix: string = "mdi";
const iconName: string = "home";
const templateName: keyof typeof templates = "vue";

const config: Config = new Config();

const svg: string = await api.downloadIcon(config, prefix, iconName);

const collections = await api.getCollections(config, [prefix]);
const collection = collections.mdi;

const template = applyTemplate(templateName, prefix, iconName, collection, svg);
```
