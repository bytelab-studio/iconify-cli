/**
 * A configuration class for managing application behavior.
 */
export class Config {
    public apiHost: string = "api.iconify.design"

    public apiPort: number = 443;

    public outDir: string = process.cwd();

    public placement: string | null = null;

    public naming: string | null = null;

    public template: string | null = null;

    public constructor() {
    }
}