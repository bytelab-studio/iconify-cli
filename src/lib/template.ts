import * as os from "node:os";

import {IconifyInfo} from "@iconify/types";

import _raw from "@lib/templates/raw";
import _rawTs from "@lib/templates/raw-ts";
import _svg from "@lib/templates/svg";
import _vue from "@lib/templates/vue";
import packageJSON from "../../package.json";

export {default as configTemplate} from "@lib/templates/config";

/**
 * An object containing templates mapped to their respective keys.
 *
 * @property raw    - A raw ESM JavaScript template
 * @property raw-ts - A raw ESM TypeScript template
 * @property svg    - A raw svg file template
 * @property vue - A Vue.js template
 */
export const templates = {
    raw: _raw,
    "raw-ts": _rawTs,
    svg: _svg,
    vue: _vue
}

function getTemplatePrefix(key: keyof typeof templates): string {
    switch (key) {
        case "raw":
        case "raw-ts":
            return " * ";
        case "svg":
        case "vue":
            return "";
    }
}

function format(base: string, args: Record<string, string>): string {
    return base.replace(/\{(\S+)}/g, (raw: string, index: any) => {
        const value: string | undefined = args[index];

        return typeof value == "undefined"
            ? raw
            : value;
    });
}

export function decodeTemplate(template: string): string {
    return Buffer.from(template, "base64").toString("utf-8");
}

function buildCommentString(prefix: string, icon: string, collection: IconifyInfo, commentPrefix: string): string {
    return [
        `This file was generated with the UNOFFICIAL Iconify CLI v${packageJSON.version}`,
        "",
        `Icon: ${prefix}:${icon}`,
        `Collection: ${collection.name}`,
        `License: ${collection.license.title} (${collection.license.spdx ?? 'N/A'})`,
        `Version: ${collection.version ?? "N/A"}`,
        `Author: ${collection.author.name} (${collection.author.url ?? "N/A"})`,
        `Downloaded: ${(new Date()).toISOString()}`
    ].map(l => commentPrefix + l).join(os.EOL);
}

/**
 * Applies a specified template to the given SVG string with additional metadata.
 *
 * @param templateName - The name identifier of the template to apply.
 * @param template - The encoded template string to be processed and applied.
 * @param prefix - The collections prefix (mdi, material-icons)
 * @param icon   - The name of the icon
 * @param collection - Metadata object describing the collection properties.
 * @param svg - The SVG string to be processed using the template.
 *
 * @return The resulting string after the template has been applied and processed with the SVG and metadata.
 */
export function applyTemplate(templateName: keyof typeof templates, template: string, prefix: string, icon: string, collection: IconifyInfo, svg: string): string {
    const comment: string = buildCommentString(prefix, icon, collection, getTemplatePrefix(templateName));
    template = decodeTemplate(template);

    return format(template, {
        "license": comment,
        "svg": svg,
        "svg:base64": Buffer.from(svg, "utf-8").toString("base64"),
        "icon": icon,
        "collection": prefix
    });
}

/**
 * Retrieves the file extension for the specified template name.
 *
 * @param templateName - The name of the template whose file extension is needed.
 *
 * @return The file extension associated with the given template name.
 */
export function getTemplateFileExtension(templateName: keyof typeof templates): string {
    switch (templateName) {
        case "raw":
            return ".js";
        case "raw-ts":
            return ".ts";
        case "svg":
            return ".svg";
        case "vue":
            return ".vue";
    }
}