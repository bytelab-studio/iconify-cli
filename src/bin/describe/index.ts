import {OptionSet, SubCommandSet} from "@koschel-christoph/node.options";

import icon from "@bin/describe/icon";

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

function* describe(_: SubCommandSet): Generator<SubCommandSet> {
    const set = new SubCommandSet(
        "Usage: iconify describe <subcommand> [<options>]",
        handler,
        icon
    );

    yield set;
}

const command: [string, string, (handler: SubCommandSet) => Generator<SubCommandSet>] = ["describe", "Describe commands", describe];
export default command;