import * as fs from "fs";

import {OptionSet} from "@koschel-christoph/node.options";

import {configTemplate, decodeTemplate} from "@lib";
import {CONFIG_FILE_NAME} from "@bin/config-helper";
import path from "path";
import Console from "@bin/console";

function* init() {
    let help: boolean = false;

    const set: OptionSet = new OptionSet(
        "Usage: iconify config init",
        ["h|help", "Prints this help text", () => help = true],
    );
    yield set;

    if (help) {
        set.printHelpString(process.stdout);
        return;
    }

    const filePath: string = path.join(process.cwd(), CONFIG_FILE_NAME);
    const decodedTemplate: string = decodeTemplate(configTemplate);
    Console.writeInfo(`Write config to '${filePath}'`);
    fs.writeFileSync(filePath, decodedTemplate);
}

const command: [string, string, () => Generator<OptionSet>] = ["init", "Creates a config file in the current working directory", init];
export default command;