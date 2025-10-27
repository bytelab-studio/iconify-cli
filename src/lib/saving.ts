import path from "path";

import {getTemplateFileExtension, templates} from "@lib/template";

/**
 * Represents a strategy for placing files
 */
export const enum PlacementStrategy {
    /**
     * Everything is placed into a single folder
     */
    FLAT,
    /**
     * Everything is placed into a single folder, and each icon is prefixed with the collection prefix
     */
    PREFIXED,
    /**
     * Creates for each collection prefix a folder and sortes the icons according to it
     */
    GROUPED
}

/**
 * Enum representing various naming strategies for string transformation.
 * Used to specify the desired case or format for names.
 */
export enum NamingStrategy {
    /**
     * Strategy for lowercase
     */
    LOWER,
    /**
     * Strategy for UPPERCASE
     */
    UPPER,
    /**
     * Strategy for camelCase
     */
    CAMEL,
    /**
     * Strategy for PascalCase
     */
    PASCAL,
    /**
     * Strategy for kebab-case
     */
    KEBAB
}

/**
 * Transforms an array of strings into a single string based on the specified naming strategy.
 *
 * @param parts    - An array of strings to be transformed.
 * @param strategy - The naming strategy to apply.
 *
 * @return The transformed string based on the specified naming strategy.
 */
function transformString(parts: string[], strategy: NamingStrategy): string {
    const normalizedParts: string[] = parts.map(part => part.toLowerCase());

    switch (strategy) {
        case NamingStrategy.LOWER:
            return normalizedParts.join("");
        case NamingStrategy.UPPER:
            return normalizedParts.join("").toUpperCase();
        case NamingStrategy.CAMEL:
            return normalizedParts
                .map((part: string, index: number) =>
                    index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
                )
                .join("");
        case NamingStrategy.PASCAL:
            return normalizedParts
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join("");
        case NamingStrategy.KEBAB:
            return normalizedParts.join("-");
    }
}

export interface IconPathInfo {
    filename: string;
    folder: string;
    filepath: string;
}

/**
 * Generates the complete path information for an icon file based on the given parameters.
 *
 * @param baseDir - The base directory from where the generated data should be appended to
 * @param templateName - The used template name
 * @param prefix - The collections prefix (mdi, material-icons)
 * @param icon   - The name of the icon
 * @param namingStrategy - Defines the naming strategy for the icon file
 * @param placementStrategy - Specifies where the icon should be placed
 *
 * @return An object containing the generated result
 */
export function generateIconPath(baseDir: string, templateName: keyof typeof templates, prefix: string, icon: string, namingStrategy: NamingStrategy, placementStrategy: PlacementStrategy): IconPathInfo  {
    const iconParts: string[] = icon.split("-");
    if (placementStrategy == PlacementStrategy.PREFIXED) {
        iconParts.unshift(...prefix.split("-"));
    }
    const filename: string = transformString(iconParts, namingStrategy) + getTemplateFileExtension(templateName);
    const folder: string = placementStrategy == PlacementStrategy.GROUPED
        ? path.join(baseDir, prefix)
        : baseDir;
    const filepath: string = path.join(folder, filename);

    return {
        filename,
        folder,
        filepath
    }
}