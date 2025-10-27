import {OptionSet, SubCommandSet} from "@koschel-christoph/node.options";

import init from "@bin/config/init";

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

function* config(_: SubCommandSet): Generator<SubCommandSet> {
    const set = new SubCommandSet(
        "Usage: iconify config <subcommand> [<options>]",
        handler,
        init
    );

    yield set;
}

const command: [string, string, (handler: SubCommandSet) => Generator<SubCommandSet>] = ["config", "Config commands", config];
export default command;