import {OptionSet} from "@koschel-christoph/node.options";
import {IconifyInfo} from "@iconify/types";

import {api, Config} from "@lib";
import Console from "@bin/console";
import {applyConfigFile, getConfigModificationFlags} from "@bin/config-helper";
import {Table} from "@bin/table";

function* collection(): Generator<OptionSet> {
    const config: Config = new Config();
    applyConfigFile(config);

    let collection: string | null = null;
    let help: boolean = false;

    const set: OptionSet = new OptionSet(
        "Usage: iconify describe collection <collection> [<options>]",
        ["h|help", "Prints this help text", () => help = true],
        ...getConfigModificationFlags(config),
        ["<>", "The collection prefix to fetch information about", v => collection = v],
    );

    yield set;

    if (help) {
        set.printHelpString(process.stdout);
        return;
    }

    if (!collection) {
        Console.writeError("Collection need to be specified");
        process.exit(1);
    }

    Console.writeFetch(`Fetch /collections?prefix=${collection}`);
    api.getCollections(config, [collection]).then((informations: Record<string, IconifyInfo>) => {
        const information: IconifyInfo = informations[collection!];
        const table: Table = new Table(2);
        table.addRow("Prefix", collection);
        table.addRow("Name", information.name);

        if (information.version) {
            table.addRow("Version", information.version);
        }

        table.addRow("Author", information.author.name);
        if (information.author.url) {
            table.addRow("Author-URL", information.author.url);
        }

        table.addRow("License", information.license.title);
        if (information.license.spdx) {
            table.addRow("License-SPDX", information.license.spdx);
        }
        if (information.license.url) {
            table.addRow("License-URL", information.license.url);
        }

        if (information.total) {
            table.addRow("Total icons", information.total);
        }
        if (information.tags) {
            table.addRow("Tags", information.tags.join(", "));
        }

        console.log(table.toString());
    });
}

const command: [string, string, () => Generator<OptionSet>] = ["collection", "Fetches information about a specific collection", collection];
export default command;