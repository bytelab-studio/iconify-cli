import * as fs from "fs";
import * as path from "path";

import {OptionFieldArgument} from "@koschel-christoph/node.options";

import {Config} from "@lib";
import {IniFile, IniFileSection} from "@bin/ini";
import Console from "@bin/console";

/**
 * The name of the configuration file used by the application
 */
export const CONFIG_FILE_NAME = ".iconify.ini";

/**
 * Determines if the given directory path represents a root folder
 *
 * @param dir - The directory path to check
 *
 * @return Returns true if the given directory is a root folder, otherwise false
 */
function isRootFolder(dir: string): boolean {
    const normalized: string = path.resolve(dir);
    const parentDir: string = path.dirname(normalized);
    return normalized == parentDir;
}

/**
 * Recursively searches for the nearest configuration file starting from the specified base directory
 *
 * @param baseDir - The directory from which the search begins
 *
 * @return The full path to the configuration file if found, or null if no file is found
 */
function findNearestConfigFile(baseDir: string): string | null {
    const items: string[] = fs.readdirSync(baseDir);
    if (items.includes(CONFIG_FILE_NAME)) {
        return path.join(baseDir, CONFIG_FILE_NAME);
    }

    if (isRootFolder(baseDir)) {
        return null;
    }

    return findNearestConfigFile(path.join(baseDir, ".."));
}

/**
 * Applies API settings from the INI file section to the provided configuration object
 *
 * @param config  - The configuration object that will be updated with API settings
 * @param section - The INI file section containing API configuration values
 */
function applyAPIConfig(config: Config, section: IniFileSection | null): void {
    if (!section) {
        return;
    }

    if (section.hasValue("host")) {
        config.apiHost = section.getString("host");
    }

    if (section.hasValue("port")) {
        config.apiPort = section.getInteger("port");
    }
}

/**
 * Applies output settings from the INI file section to the provided configuration object
 *
 * @param config     - The configuration object that will be updated with output settings
 * @param section    - The INI file section containing output configuration settings
 * @param configFile - The file path of the INI file
 */
function applyOutputConfig(config: Config, section: IniFileSection | null, configFile: string): void {
    if (!section) {
        return;
    }

    if (section.hasValue("out_dir")) {
        let outDir: string = section.getString("out_dir");
        if (!path.isAbsolute(outDir)) {
            outDir = path.join(path.dirname(configFile), outDir);
        }

        config.outDir = outDir;
    }
    if (section.hasValue("placement")) {
        config.placement = section.getString("placement");
    }
    if (section.hasValue("naming")) {
        config.naming = section.getString("naming");
    }
    if (section.hasValue("template")) {
        config.template = section.getString("template");
    }
}

/**
 * Applies configuration settings from a configuration file.
 *
 * @param config - The configuration object to which the settings will be applied.
 */
export function applyConfigFile(config: Config): void {
    const configFile: string | null = findNearestConfigFile(process.cwd());
    if (!configFile) {
        return;
    }

    Console.writeInfo(`Config found in '${configFile}'`);
    try {
        const iniFile: IniFile = IniFile.fromFile(configFile);
        applyAPIConfig(config, iniFile.tryGetSection("api"));
        applyOutputConfig(config, iniFile.tryGetSection("output"), configFile);
    } catch (err: any) {
        Console.writeError("Failed to parse config file:");
        Console.writeLine(err.toString());
        process.exit(1);
    }
}

/**
 * Generates an array of configuration flags that override the config object
 *
 * @param config - The configuration object to be modified by the flags.
 *
 * @return An array of flag definitions
 */
export function getConfigModificationFlags(config: Config): OptionFieldArgument[] {
    return [
        ["config-host=", "Sets the API {host}", v => config.apiHost = v],
        ["config-port=", "Sets the API {port}", v => {
            const value: number = parseFloat(v);
            if (!Number.isFinite(value) || !Number.isInteger(value)) {
                Console.writeError("config-port is not a valid integer");
                process.exit(1);
            }

            config.apiPort = value;
        }]
    ];
}