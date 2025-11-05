# `iconify describe icon <icon>`

Prints information about a specific icon

## 🔧 Options

| Flag             | Description                       |
|------------------|-----------------------------------|
| `--config-host=` | Overrides the target api hostname |
| `--config-port=` | Overrides the target api port     |
| `-h` \| `--help` | Prints a help text                |

## ⚙️ Programmatic example

```typescript
import {Config, api} from "iconify-cli";
import type {IconifyJSONIconsData} from "@iconify/types";

const config: Config = new Config();

const infos: IconifyJSONIconsData = await api.getIconsInformation(config, "mdi", ["home"]);
```
