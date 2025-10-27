import * as fs from "fs";

/**
 * Represents a section in an INI file, providing methods to extract values
 * of various data types by key
 */
export class IniFileSection {
    private readonly name: string;
    private readonly data: Record<string, string[]>;

    /**
     * @internal
     */
    public constructor(name: string, data: Record<string, string[]>) {
        this.name = name;
        this.data = data;
    }

    /**
     * Retrieves an array of values associated with the specified key from the ini file section
     *
     * @param name - The name of the key to retrieve values for
     *
     * @return An array of strings containing the retrieved values for the key name
     *
     * @throws {IniFileException} If the key does not have any associated values or does not exist
     */
    public getValues(name: string): string[] {
        if (name in this.data) {
            return this.data[name];
        }

        throw new IniFileException(`Section '${this.name}' contains now values for the key '${name}`);
    }

    /**
     * Checks if the specified key name exist in the section
     *
     * @param name - The name to check for existence.
     *
     * @return Returns true if the name exists in the section, otherwise false.
     */
    public hasValue(name: string): boolean {
        return name in this.data;
    }

    /**
     * Retrieves a string value associated with the specified key from the current section
     *
     * @param name - The name of the key to retrieve values for
     *
     * @return The string value associated with the specified key
     *
     * @throws {IniFileException} If the specified key contains no values
     * @throws {IniFileException} If the specified key contains multiple values
     */
    public getString(name: string): string {
        if (name in this.data) {
            if (this.data[name].length == 1) {
                return this.data[name][0];
            }

            throw new IniFileException(`Section '${this.name}' contains multiple values for the key '${name}'`);
        }

        throw new IniFileException(`Section '${this.name}' contains now values for the key '${name}`);
    }

    /**
     * Retrieves a value associated with the specified key from the current section and casts it into an integer
     *
     * @param name - The name of the key to retrieve values for
     *
     * @return The integer value associated with the specified name
     *
     * @throws {IniFileException} If the specified key contains no values
     * @throws {IniFileException} If the specified key contains multiple values
     * @throws IniFileException If the value is not a valid integer
     */
    public getInteger(name: string): number {
        const raw: string = this.getString(name);
        const value: number = parseFloat(raw);
        if (!Number.isFinite(value) || !Number.isInteger(value)) {
            throw new IniFileException(`Value '${raw}' is not a valid integer in section '${this.name}' for '${name}'`);
        }

        return value;
    }

    /**
     * Retrieves a value associated with the specified key from the current section and casts it into a number
     *
     * @param name - The name of the key to retrieve values for
     *
     * @return The number value associated with the specified name
     *
     * @throws {IniFileException} If the specified key contains no values
     * @throws {IniFileException} If the specified key contains multiple values
     * @throws IniFileException If the value is not a valid number
     */
    public getNumber(name: string): number {
        const raw: string = this.getString(name);
        const value: number = parseFloat(raw);
        if (!Number.isFinite(value)) {
            throw new IniFileException(`Value '${raw}' is not a valid number in section '${this.name}' for '${name}'`);
        }

        return value;
    }

    /**
     * Retrieves a value associated with the specified key from the current section and casts it into a boolean
     *
     * - Valid truthy values are 'true', 'True', '1'
     * - Valid falsy values are 'false', 'False', '0'
     *
     * Everything else is seen as an invalid value
     *
     * @param name - The name of the key to retrieve values for
     *
     * @return The boolean value associated with the specified name
     *
     * @throws {IniFileException} If the specified key contains no values
     * @throws {IniFileException} If the specified key contains multiple values
     * @throws IniFileException If the value is not a valid boolean
     */
    public getBoolean(name: string): boolean {
        const raw: string = this.getString(name);
        if (raw != "true" && raw != "True" && raw != "false" && raw != "False" && raw != "1" && raw != "0") {
            throw new IniFileException(`Value '${raw}' is not a valid boolean, in section '${this.name}' for '${name}'`);
        }

        return raw == "True" || raw == "true" || raw == "1";
    }
}

/**
 * Represents a parsed INI file, containing sections with key-value pairs.
 * Provides methods to retrieve sections and parse INI files from disk.
 */
export class IniFile {
    private data: Record<string, Record<string, string[]>>;

    private constructor(data: Record<string, Record<string, string[]>>) {
        this.data = data;
    }

    /**
     * Retrieves a section from the INI file by its name.
     *
     * @param {string} name - The name of the section to retrieve.
     *
     * @return {IniFileSection} The section associated with the specified name.
     *
     * @throws {IniFileException} If the section does not exist.
     */
    public getSection(name: string): IniFileSection {
        if (!(name in this.data)) {
            throw new IniFileException(`Unknown section '${name}'`);
        }
        return new IniFileSection(name, this.data[name]);
    }

    public tryGetSection(name: string): IniFileSection | null {
        try {
            return this.getSection(name);
        } catch (e: unknown) {
            if (e instanceof  IniFileException) {
                return null;
            }

            throw e;
        }
    }

    /**
     * Creates an IniFile instance by reading and parsing the contents of a file at the specified path.
     *
     * @param path - The file path to read the INI data from.
     *
     * @return An IniFile instance containing the parsed data.
     *
     * @throws IniFileException If the file has an invalid format or contains invalid lines.
     */
    public static fromFile(path: string): IniFile {
        const lines: string[] = fs.readFileSync(path, "utf-8")
            .split("\n")
            .map(line => line.trim());

        const data: Record<string, Record<string, string[]>> = {
            [IniFile.DEFAULT_SECTION]: {}
        };

        let activeSession: string = IniFile.DEFAULT_SECTION;

        for (let i: number = 0; i < lines.length; i++) {
            const line: string = lines[i];
            if (line.startsWith(";") || !line) {
                continue;
            }

            if (line.startsWith("[") && line.endsWith("]")) {
                activeSession = line.substring(1, line.length - 1);
                if (!(activeSession in data)) {
                    data[activeSession] = {};
                }
                continue;
            }

            const matchResult: RegExpMatchArray | null = line.match(/^(\S+)\s*=\s*(\S+)$/);
            if (!matchResult) {
                throw new IniFileException("Line has wrong format", i + 1);
            }

            const key: string = matchResult[1];
            const value: string = matchResult[2];

            if (key in data[activeSession]) {
                data[activeSession][key].push(value);
                continue;
            }

            data[activeSession][key] = [value];
        }

        return new IniFile(data);
    }

    /**
     * A constant string used to represent the default section identifier.
     * This variable acts as a placeholder or fallback for cases where
     * no specific section is defined or selected.
     */
    public static readonly DEFAULT_SECTION: string = "[__DEFAULT__]";
}

/**
 * An exception that represents errors specific to parsing or handling INI files.
 */
export class IniFileException extends Error {
    public readonly line?: number;

    public constructor(message: string, line?: number) {
        super(message);

        this.name = "IniFileException";
        this.line = line;
    }

    public toString(): string {
        let base: string = `${this.name}: ${this.message}`;
        if (this.line) {
            base += ` (at line ${this.line})`;
        }

        return base;
    }
}