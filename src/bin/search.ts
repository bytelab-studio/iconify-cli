import {OptionSet} from "@koschel-christoph/node.options";

import {api, Config} from "@lib";
import Console from "@bin/console";
import {Table} from "@bin/table";
import {applyConfigFile, getConfigModificationFlags} from "@bin/config-helper";

function* search() {
    let config: Config = new Config();
    applyConfigFile(config);

    let help: boolean = false;
    let search: string = "";
    let limit: string | null = null;
    let offset: string | null = null;
    const prefixes: string[] = [];

    const set: OptionSet = new OptionSet(
        "Usage: iconify search <pattern> [<option>]",
        ["l=|limit=", "Sets the result {limit}", v => limit = v],
        ["o=|offset=", "Sets the result {offset}", v => offset = v],
        ["p=|prefix=", "Search after a specific {prefix}", v => prefixes.push(v)],
        ...getConfigModificationFlags(config),
        ["h|help", "Prints this help text", () => help = true],
        ["<>", "The search pattern", v => search = v]
    );
    yield set;

    if (help) {
        set.printHelpString(process.stdout);
        return;
    }

    if (!search) {
        Console.writeError("Missing search pattern");
        process.exit(1);
    }

    let limitValue: number | null = null;
    let offsetValue: number | null = null;

    if (offset) {
        offsetValue = parseFloat(offset);
        if (!Number.isFinite(offsetValue) || !Number.isInteger(offsetValue)) {
            Console.writeError(`Offset is not a valid integer '${offset}'`);
            process.exit(1);
        }

        if (offsetValue < 0) {
            Console.writeError("Offset cannot be negative");
            process.exit(1);
        }
    }

    if (limit) {
        limitValue = parseFloat(limit);
        if (!Number.isFinite(limitValue) || !Number.isInteger(limitValue)) {
            Console.writeError(`Limit is not a valid integer '${limit}'`);
            process.exit(1);
        }

        if (limitValue < 32) {
            Console.writeError("Limit must be greater or equals 32");
            process.exit(1);
        }
        if (limitValue > 999) {
            Console.writeError("Limit cannot be greater than 999");
            process.exit(1);
        }
    }

    if (offsetValue == null) {
        offsetValue = 0;
    }
    if (limitValue == null) {
        limitValue = 999;
    }

    Console.writeFetch("Fetch /search");
    api.searchIcon(config, search, prefixes, limitValue, offsetValue).then((result: api.IconifySearchResult): void => {
        Console.writeInfo(`Found ${result.total} icons for '${search}'`);
        Console.writeLine("");
        const table: Table = new Table(4);
        for (let i: number = 0; i < result.icons.length; i += 4) {
            const chunk: string[] = result.icons.slice(i, i + 4);
            if (chunk.length != 4) {
                chunk.push(...Array.from({length: 4 - chunk.length}, () => ""));
            }

            table.addRow(...chunk);
        }

        Console.write(table.toString());
    }).catch((err: api.APIException): never => {
        Console.writeError("Failed to fetch url:");
        Console.writeLine(err.toString());
        process.exit(1);
    });
}

const command: [string, string, () => Generator<OptionSet>] = ["search", "Search a icon", search];
export default command;