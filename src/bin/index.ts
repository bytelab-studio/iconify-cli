#!/usr/bin/env node
import {OptionSet, SubCommandSet} from "@koschel-christoph/node.options";

import sets from "@bin/sets";
import search from "@bin/search";
import download from "@bin/download";
import config from "@bin/config";
import describe from "@bin/describe";

import packageJSON from "../../package.json";

function* handler(handler: SubCommandSet, commandNotFound: boolean): Generator<OptionSet> {
    let help: boolean = false;
    let version: boolean = false;

    yield new OptionSet(
        "Usage: iconify <command> [<options>]",
        ["v|version", "Display CLI version", () => version = true],
        ["h|help", "Prints this help text", () => help = true]
    );

    if (version) {
        console.log("Iconify CLI v" + packageJSON.version);
        return;
    }

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
    config,
    describe
);

cli.parse(process.argv);