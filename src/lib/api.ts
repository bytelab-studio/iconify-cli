import * as http from "http";
import * as https from "https";
import * as os from "os";

import {type IconifyInfo, IconifyJSONIconsData} from "@iconify/types";

import {Config} from "@lib/config";

/**
 * Helper function to make an HTTP request using Node's http module.
 *
 * @param method  - The HTTP Verb
 * @param host    - The host of the requesting url
 * @param port    - The port of the requesting url
 * @param path    - The path of the requesting url
 * @param data    - The requests payload
 * @param headers - A header map for modified request headers
 *
 * @returns Always the response data as Buffer
 */
function sendHttpRequest(
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
    host: string,
    port: number,
    path: string,
    data?: Buffer | string,
    headers: Record<string, string> = {},
): Promise<Buffer> {
    return new Promise((resolve: (v: Buffer) => void, reject: (reason: any) => void): void => {
        const req: http.ClientRequest = https.request({
            host,
            port,
            path,
            method,
            headers
        }, (res: http.IncomingMessage) => {
            if (!res.statusCode || res.statusCode < 200 || res.statusCode > 299) {
                reject(new APIException(`Request returned '${res.statusCode}' status code`, host, path));
            }

            const chunks: Buffer[] = [];

            res.on("data", (chunk: Buffer) => chunks.push(chunk));
            res.on("end", () => resolve(Buffer.concat(chunks)));
        });

        req.on("error", err => reject(new APIException("Failed to fetch URL", host, path, err)));

        if (method != "GET" && method != "DELETE" && data) {
            req.write(data);
        }

        req.end();
    });
}

/**
 * Helper function to make an HTTP GET requests
 *
 * @param host    - The host of the requesting url
 * @param host    - The port of the requesting url
 * @param path    - The path of the requesting url
 * @param headers - A header map for modified request headers
 *
 * @returns Always the response data as Buffer
 */
function sendHttpGetRequest(
    host: string,
    port: number,
    path: string,
    headers?: Record<string, string>
): Promise<Buffer> {
    return sendHttpRequest("GET", host, port, path, undefined, headers);
}

/**
 * Helper function to make an HTTP POST requests
 *
 * @param host    - The host of the requesting url
 * @param path    - The path of the requesting url
 * @param port    - The port of the requesting url
 * @param data    - The payload of the request
 * @param headers - A header map for modified request headers
 *
 * @returns Always the response data as Buffer
 */
function sendHttpPostRequest(
    host: string,
    port: number,
    path: string,
    data?: Buffer | string,
    headers?: Record<string, string>
): Promise<Buffer> {
    return sendHttpRequest("POST", host, port, path, data, headers);
}

/**
 * Helper function to make an HTTP PUT requests
 *
 * @param host    - The host of the requesting url
 * @param port    - The port of the requesting url
 * @param path    - The path of the requesting url
 * @param data    - The payload of the request
 * @param headers - A header map for modified request headers
 *
 * @returns Always the response data as Buffer
 */
function sendHttpPutRequest(
    host: string,
    port: number,
    path: string,
    data?: Buffer | string,
    headers?: Record<string, string>
): Promise<Buffer> {
    return sendHttpRequest("PUT", host, port, path, data, headers);
}

/**
 * Helper function to make an HTTP PATCH requests
 *
 * @param host    - The host of the requesting url
 * @param port    - The port of the requesting url
 * @param path    - The path of the requesting url
 * @param data    - The payload of the request
 * @param headers - A header map for modified request headers
 *
 * @returns Always the response data as Buffer
 */
function sendHttpPatchRequest(
    host: string,
    port: number,
    path: string,
    data?: Buffer | string,
    headers?: Record<string, string>
): Promise<Buffer> {
    return sendHttpRequest("PATCH", host, port, path, data, headers);
}

/**
 * Helper function to make an HTTP GET requests
 *
 * @param host    - The host of the requesting url
 * @param port    - The port of the requesting url
 * @param path    - The path of the requesting url
 * @param headers - A header map for modified request headers
 *
 * @returns Always the response data as Buffer
 */
function sendHttpDeleteRequest(
    host: string,
    port: number,
    path: string,
    headers?: Record<string, string>
): Promise<Buffer> {
    return sendHttpRequest("DELETE", host, port, path, undefined, headers);
}

/**
 * Retrieves an object with information about all available icon sets
 *
 * @param config   - The configuration object containing API host details.
 * @param prefixes - A list of prefixes to filter the collections
 *
 * @return A object with information about all available icon sets
 *
 * @throws {APIException} If the request failed
 * @throws {APIException} If the response cannot be parsed
 */
export async function getCollections(config: Config, prefixes: string[]): Promise<Record<string, IconifyInfo>> {
    let query: string;
    if (prefixes.length == 0) {
        query = "";
    } else {
        query = "prefixes=" + prefixes.map(p => encodeURIComponent(p)).join(",");
    }

    const buffer: Buffer = await sendHttpGetRequest(config.apiHost, config.apiPort, `/collections?${query}`);
    try {
        const content: string = buffer.toString("utf-8");
        return JSON.parse(content);
    } catch {
        throw new APIException("Failed to parse response", config.apiHost, "/collections");
    }
}

export interface IconifySearchResult {
    icons: string[],
    total: number;
    limit: number;
    start: number;
}

/**
 * Searches for an icon based on the given parameters.
 *
 * @param config   - The configuration object containing API host details
 * @param search   - The search term to query for icons
 * @param prefixes - A list of prefixes to filter the collections
 * @param limit    - The maximum number of results to return
 * @param offset   - The starting index for the search results
 *
 * @return A object containing information about the search result
 *
 * @throws {APIException} If the request failed
 * @throws {APIException} If the response cannot be parsed
 */
export async function searchIcon(config: Config, search: string, prefixes: string[], limit: number, offset: number): Promise<IconifySearchResult> {
    let query: string = `query=${encodeURIComponent(search)}`;
    if (prefixes.length > 0) {
        query += "&prefixes=" + prefixes.map(p => encodeURIComponent(p)).join(",");
    }
    if (limit) {
        query += `&limit=${limit}`;
    }
    if (offset) {
        query += `&start=${offset}`;
    }

    const buffer: Buffer = await sendHttpGetRequest(config.apiHost, config.apiPort, `/search?${query}`);
    try {
        const content: string = buffer.toString("utf-8");
        return JSON.parse(content);
    } catch {
        throw new APIException("Failed to parse response", config.apiHost, "/search");
    }
}

/**
 * Fetches icons' information of a specific collection
 *
 * @param config - The configuration object containing API host details
 * @param prefix - The collections prefix (mdi, material-icons)
 * @param icons  - An array of icon names to fetch information for
 *
 * @return A object with the desire information of the requested icons
 *
 * @throws {APIException} If the request failed
 * @throws {APIException} If the response cannot be parsed
 */
export async function getIconsInformation(config: Config, prefix: string, icons: string[]): Promise<IconifyJSONIconsData> {
    const query: string = "icons=" + icons.map(i => encodeURIComponent(i)).join(",");

    const buffer: Buffer = await sendHttpGetRequest(config.apiHost, config.apiPort, `/${encodeURIComponent(prefix)}.json?${query}`);
    try {
        const content: string = buffer.toString("utf-8");
        return JSON.parse(content);
    } catch {
        throw new APIException("Failed to parse response", config.apiHost, `/${encodeURIComponent(prefix)}.json?${query}`);
    }
}

/**
 * Downloads an icon as an SVG string
 *
 * @param config - The configuration object containing API host details
 * @param prefix - The collections prefix (mdi, material-icons)
 * @param icon   - The name of the icon
 *
 * @return The SVG content of the requested icon as a string.
 *
 * @throws {APIException} If the request failed
 * @throws {APIException} If the response cannot be parsed
 */
export async function downloadIcon(config: Config, prefix: string, icon: string): Promise<string> {
    const buffer: Buffer = await sendHttpGetRequest(config.apiHost, config.apiPort, `/${encodeURIComponent(prefix)}/${encodeURIComponent(icon)}.svg`);
    try {
        return buffer.toString("utf-8");
    } catch {
        throw new APIException("Failed to parse response", config.apiHost, `/${encodeURIComponent(prefix)}/${encodeURIComponent(icon)}.svg`);
    }
}

/**
 * Represents an exception that occurs during an API operation.
 */
export class APIException extends Error {
    public readonly host: string;
    public readonly path: string;
    public readonly innerError?: Error;

    public constructor(message: string, host: string, path: string, innerError?: Error) {
        super(message);

        this.name = "APIException";
        this.host = host;
        this.path = path;
        this.innerError = innerError;
    }

    public toString(): string {
        let base: string = `${this.name} '${this.host}${this.path}': ${this.message}`;
        if (this.innerError) {
            base += os.EOL;
            base += `InnerException: ${this.innerError.toString()}`;
        }

        return base;
    }
}