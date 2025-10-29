import * as fs from "fs";

import {OptionSet} from "@koschel-christoph/node.options";
import {IconifyInfo} from "@iconify/types";

import {
    api,
    applyTemplate,
    Config,
    generateIconPath,
    IconPathInfo,
    NamingStrategy,
    PlacementStrategy,
    templates
} from "@lib";
import Console from "@bin/console";
import {applyConfigFile, getConfigModificationFlags} from "@bin/config-helper";

function* download() {
    const config: Config = new Config();
    applyConfigFile(config);

    let help: boolean = false;
    const icons: string[] = [];
    let templateOption: string | null = config.template;
    let placementOption: string | null = config.placement;
    let namingOption: string | null = config.naming;
    let output: string = config.outDir;

    const set: OptionSet = new OptionSet(
        "Usage: iconify download <icon> [<option>]",
        ["t=|template=", "The {template} to which the icon gets wrapped to", v => templateOption = v],
        ["p=|placement=", "The placement {strategy} that should be used", v => placementOption = v],
        ["n=|naming=", "The naming {strategy} that should be used", v => namingOption = v],
        ["o=|output=", "The output base {folder} where the icons are placed", v => output = v],
        ...getConfigModificationFlags(config),
        ["h|help", "Prints this help text", () => help = true],
        ["<>", "The icons full name", v => icons.push(v)]
    );

    yield set;

    if (help) {
        set.printHelpString(process.stdout);
        return;
    }

    if (icons.length == 0) {
        Console.writeError("At least one icon needs to be specified");
        process.exit(1);
    }

    if (!templateOption) {
        Console.writeError("Missing required option '-t' or '--template'");
        process.exit(1);
    }

    if (!(templateOption in templates)) {
        Console.writeError(`Unknown template '${templateOption}', possible templates are ${Object.keys(templates).join(", ")}`);
        process.exit(1);
    }

    if (!placementOption) {
        Console.writeError("Missing required option '-p' or '--placement'");
        process.exit(1);
    }

    const placement: PlacementStrategy = ((): PlacementStrategy => {
        switch (placementOption) {
            case "flat":
                return PlacementStrategy.FLAT;
            case "prefixed":
                return PlacementStrategy.PREFIXED;
            case "grouped":
                return PlacementStrategy.GROUPED;
        }

        Console.writeError(`Unknown placement strategy '${placementOption}', possible strategies are 'flat', 'prefixed' or 'grouped'`);
        process.exit(1);
    })();

    if (!namingOption) {
        Console.writeError("Missing required option '-n' or '--naming'");
        process.exit(1);
    }

    const naming: NamingStrategy = ((): NamingStrategy => {
        switch (namingOption) {
            case "lower":
                return NamingStrategy.LOWER;
            case "upper":
                return NamingStrategy.UPPER;
            case "camel":
                return NamingStrategy.CAMEL;
            case "pascal":
                return NamingStrategy.PASCAL;
            case "kebab":
                return NamingStrategy.KEBAB;
        }

        Console.writeError(`Unknown naming strategy '${namingOption}', possible strategies are 'lower', 'upper', 'camel', 'pascal' or 'kebab'`);
        process.exit(1);
    })();

    const templateName: keyof typeof templates = templateOption as keyof typeof templates;

    (async () => {
        let successfullyDownloaded: number = 0;
        const infos: Map<string, IconifyInfo> = new Map<string, IconifyInfo>();

        for (const icon of icons) {
            Console.writeInfo(`Download '${icon}'`);
            if (!/\w+:\w+/.test(icon)) {
                Console.writeError(`Icon identifier is in a wrong format -> SKIP`);
                continue;
            }

            const [prefix, name] = icon.split(":", 2);

            let information: IconifyInfo | undefined = infos.get(prefix);

            if (!information) {
                Console.writeFetch(`Fetch /collections?prefix=${prefix}`);
                try {
                    const result: Record<string, IconifyInfo> = await api.getCollections(config, [prefix]);
                    information = result[prefix];
                } catch (err: any) {
                    Console.writeError("Failed to fetch url:");
                    Console.writeLine(err.toString());
                    continue;
                }
                if (!information) {
                    Console.writeError("Failed to resolve collection information -> SKIP");
                    continue;
                }

                infos.set(prefix, information);
            }

            Console.writeFetch(`Fetch /${prefix}/${name}.svg`);
            try {
                const svg: string = await api.downloadIcon(config, prefix, name);
                const content: string = applyTemplate(templateName, prefix, name, information, svg);
                const savingInformation: IconPathInfo = generateIconPath(output, templateName, prefix, name, naming, placement);

                if (!fs.existsSync(savingInformation.folder) || !fs.statSync(savingInformation.folder).isDirectory()) {
                    Console.writeInfo(`Creating folder: '${savingInformation.folder}'`);
                    fs.mkdirSync(savingInformation.folder, {recursive: true});
                }

                Console.writeInfo(`Saving icon: '${savingInformation.filepath}'`);
                fs.writeFileSync(savingInformation.filepath, content);

                successfullyDownloaded++;
            } catch (err: any) {
                Console.writeError("Failed to fetch url:");
                Console.writeLine(err.toString());
            }
        }

        if (successfullyDownloaded == icons.length) {
            Console.writeInfo(`Successfully downloaded ${successfullyDownloaded} of ${icons.length} icons`);
            return;
        }

        Console.writeError(`Downloaded ${successfullyDownloaded} of ${icons.length} icons. See previous log for reasons`);
    })();
}

const command: [string, string, () => Generator<OptionSet>] = ["download", "Downloads one or more icons", download];
export default command;