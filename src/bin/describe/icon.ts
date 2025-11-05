import {OptionSet} from "@koschel-christoph/node.options";
import {ExtendedIconifyIcon, IconifyJSONIconsData} from "@iconify/types";

import {api, Config} from "@lib";
import Console from "@bin/console";
import {applyConfigFile, getConfigModificationFlags} from "@bin/config-helper";
import {Table} from "@bin/table";

function* icon() {
    const config: Config = new Config();
    applyConfigFile(config);

    let icon: string | null = null;
    let help: boolean = false;

    const set: OptionSet = new OptionSet(
        "Usage: iconify describe icon <icon> [<options>]",
        ["h|help", "Prints this help text", () => help = true],
        ...getConfigModificationFlags(config),
        ["<>", "The icon identifier to fetch information about", v => icon = v],
    );

    yield set;

    if (help) {
        set.printHelpString(process.stdout);
        return;
    }

    if (!icon) {
        Console.writeError("Icon need to be specified");
        process.exit(1);
    }

    if (!/\w+:\w+/.test(icon)) {
        Console.writeError(`Icon identifier is in a wrong format`);
        process.exit(1);
    }

    const [prefix, name] = (icon as string).split(":", 2);

    Console.writeFetch(`Fetch /${prefix}.json?icons=${name}`);
    api.getIconsInformation(config, prefix, [name]).then((information: IconifyJSONIconsData) => {
        const icon: ExtendedIconifyIcon = information.icons[name];
        const table: Table = new Table(2);
        table.addRow("Prefix", information.prefix);
        table.addRow("Name", name);
        if (information.width && information.height) {
            table.addRow("Size", `${information.width}x${information.height}`);
        }
        if (information.left && information.top) {
            table.addRow("Offset", `${information.left}x${information.top}`);
        }
        if (information.provider) {
            table.addRow("Provider", information.provider);
        }

        console.log(table.toString());
    });
}

const command: [string, string, () => Generator<OptionSet>] = ["icon", "Fetches information about a specific icon", icon];
export default command;