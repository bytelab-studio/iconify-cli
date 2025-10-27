import {OptionSet} from "@koschel-christoph/node.options";
import {type IconifyInfo} from "@iconify/types";

import {api, Config} from "@lib";
import Console from "@bin/console";
import {Table} from "@bin/table";
import {applyConfigFile, getConfigModificationFlags} from "@bin/config-helper";

function* sets() {
    let config: Config = new Config();
    applyConfigFile(config);

    let help: boolean = false;
    let limit: string | null = null;
    let offset: string | null = null;
    const prefixes: string[] = [];

    const set: OptionSet = new OptionSet(
        "Usage: iconify sets [<option>]",
        ["l=|limit=", "Sets the result {limit}", v => limit = v],
        ["o=|offset=", "Sets the result {offset}", v => offset = v],
        ["p=|prefix=", "Search after a specific {prefix}", v => prefixes.push(v)],
        ...getConfigModificationFlags(config),
        ["h|help", "Prints this help text", () => help = true],
    );
    yield set;

    if (help) {
        set.printHelpString(process.stdout);
        return;
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

        if (limitValue <= 0) {
            Console.writeError("Limit cannot be zero or negative");
            process.exit(1);
        }
    }

    if (offsetValue == null) {
        offsetValue = 0;
    }
    if (limitValue == null) {
        limitValue = -1;
    }

    Console.writeFetch("Fetch /collections");
    api.getCollections(config, prefixes).then((collection: Record<string, IconifyInfo>): void => {
        const table: Table = new Table(4);
        table.addRow("#", "Prefix", "Name", "Amount Icons");
        table.addRow("", "", "", "");

        const entries: [string, IconifyInfo][] = Object.entries(collection);
        const max: number = limitValue < 0 ? entries.length : offsetValue + limitValue;
        for (let i: number = offsetValue; i < max && i < entries.length; i++) {
            const [key, value]: [string, IconifyInfo] = entries[i];
            table.addRow(i + 1, key, value.name, value.total);
        }

        Console.write(table.toString());
    }).catch((err: api.APIException): never => {
        Console.writeError("Failed to fetch url:");
        Console.writeLine(err.toString());
        process.exit(1);
    });
}

const command: [string, string, () => Generator<OptionSet>] = ["sets", "Display information about icon sets", sets];
export default command;