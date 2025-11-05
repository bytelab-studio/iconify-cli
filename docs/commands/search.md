# `iconify search <pattern>`

Search for an icon based on the given pattern

## 🔧 Options

| Flag                 | Description                                                     |
|----------------------|-----------------------------------------------------------------|
| `-l=` \| `--limit=`  | Sets the result limit, can be any integer between `1` and `999` |
| `-o=` \| `--offset=` | Starts the result from the defined offset                       |
| `-p=` \| `--prefix=` | Search in the give icon set                                     |
| `--config-host=`     | Overrides the target api hostname                               |
| `--config-port=`     | Overrides the target api port                                   |
| `-h` \| `--help`     | Prints a help text                                              |

## ⚙️ Programmatic example

### Minimal example

```typescript
import {Config, api} from "iconify-cli";

const config: Config = new Config();

const result: api.IconifySearchResult = await api.searchIcon(config, "home", [], 0, 0);
```

### Search in a specific set

```typescript
import {Config, api} from "iconify-cli";

const config: Config = new Config();

const result: api.IconifySearchResult = await api.searchIcon(config, "home", ["mdi", "mdi-light"], 0, 0);
```

### Search with a limit and offset

```typescript
import {Config, api} from "iconify-cli";

const config: Config = new Config();

const result: api.IconifySearchResult = await api.searchIcon(config, "home", [], 10, 2);
```
