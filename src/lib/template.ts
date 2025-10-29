import * as os from "node:os";

import {IconifyInfo} from "@iconify/types";

import _raw from "@lib/templates/raw";
import _rawTs from "@lib/templates/raw-ts";
import _svg from "@lib/templates/svg";
import _vue from "@lib/templates/vue";
import _php from "@lib/templates/php";
import _jsx from "@lib/templates/jsx";
import _tsx from "@lib/templates/tsx";

import packageJSON from "../../package.json";

export {default as configTemplate} from "@lib/templates/config";

/**
 * An object containing templates mapped to their respective keys.
 *
 * @property raw    - A raw ESM JavaScript template
 * @property raw-ts - A raw ESM TypeScript template
 * @property svg    - A raw svg file template
 * @property vue    - A Vue.js template
 * @property php    - A PHP v8 template
 * @property jsx    - A JSX template
 * @property tsx    - A TSX template
 */
export const templates = {
    raw: _raw,
    "raw-ts": _rawTs,
    svg: _svg,
    vue: _vue,
    php: _php,
    jsx: _jsx,
    tsx: _tsx
}

function getTemplatePrefix(key: keyof typeof templates): string {
    switch (key) {
        case "raw":
        case "raw-ts":
        case "php":
        case "jsx":
        case "tsx":
            return " * ";
        case "svg":
        case "vue":
            return "";
    }
}

function format(base: string, args: Record<string, string>): string {
    return base.replace(/\{([^\s}]+)}/g, (raw: string, index: any) => {
        const value: string | undefined = args[index];

        return typeof value == "undefined"
            ? raw
            : value;
    });
}

/**
 * Decodes a base64-encoded template into its UTF-8 representation.
 *
 * @param template - The base64-encoded template to be decoded.
 *
 * @return The decoded UTF-8 template.
 */
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
 * @param prefix       - The collections prefix (mdi, material-icons)
 * @param icon         - The name of the icon
 * @param collection   - Metadata object describing the collection properties.
 * @param svg          - The SVG string to be processed using the template.
 *
 * @return The resulting string after the template has been applied and processed with the SVG and metadata.
 */
export function applyTemplate(templateName: keyof typeof templates, prefix: string, icon: string, collection: IconifyInfo, svg: string): string {
    const comment: string = buildCommentString(prefix, icon, collection, getTemplatePrefix(templateName));
    const template: string = decodeTemplate(templates[templateName]);

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
        case "php":
            return ".php";
        case "jsx":
            return ".jsx";
        case "tsx":
            return ".tsx";
    }
}