# `iconify describe collection <collection>`

Prints information about a collection

## 🔧 Options

| Flag             | Description                       |
|------------------|-----------------------------------|
| `--config-host=` | Overrides the target api hostname |
| `--config-port=` | Overrides the target api port     |
| `-h` \| `--help` | Prints a help text                |

## ⚙️ Programmatic example

```typescript
import {Config, api} from "iconify-cli";
import type {IconifyInfo} from "@iconify/types";

const config: Config = new Config();

const infos: Record<string, IconifyInfo> = await api.getCollections(config, ["mdi"]);
console.log(infos.mdi);
```
