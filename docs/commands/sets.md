# `iconify sets`

List all current available icon sets

## 🔧 Options

Flag                 | Description
---------------------|------------------------------------------------------
`-l=` \| `--limit=`  | Sets the result limit, can be any integer greater `0`
`-o=` \| `--offset=` | Starts the result from the defined offset
`-p=` \| `--prefix=` | Search for a specific icon set with the given prefix
`--config-host=`     | Overrides the target api hostname
`--config-port=`     | Overrides the target api port
`-h` \| `--help`     | Prints a help text

## ⚙️ Programatic example

### Minimal example

```typescript
import {Config, api} from "iconify-cli";
import type {IconifyInfo} from "@iconify/types";

const config: Config = new Config();

const collection: Record<string, IconifyInfo> = await api.getCollections(config, []);
```

### Search for specific set

```typescript
import {Config, api} from "iconify-cli";
import type {IconifyInfo} from "@iconify/types";

const config: Config = new Config();

const collection: Record<string, IconifyInfo> = await api.getCollections(config, ["mdi"]);
```
