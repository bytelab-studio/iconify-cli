import {OptionSet, SubCommandSet} from "@koschel-christoph/node.options";

import sets from "@bin/sets";
import search from "@bin/search";
import download from "@bin/download";
import config from "@bin/config";

function* handler(handler: SubCommandSet, commandNotFound: boolean): Generator<OptionSet> {
    let help: boolean = false;

    yield new OptionSet(
        "Usage: iconify <command> [<options>]",
        ["h|help", "Prints this help text", () => help = true]
    );

    if (help || commandNotFound) {
        handler.printHelpString(process.stdout);
        return;
    }
}

const cli: SubCommandSet = new SubCommandSet(
    "Usage: iconify <command> [<options>]",
    handler,
    sets,
    search,
    download,
    config
);

cli.parse(process.argv);