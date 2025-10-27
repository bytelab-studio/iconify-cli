import * as os from "os";

class Color {
    public readonly foreground: string;
    public readonly background: string;

    public constructor(foreground: string, background: string) {
        this.foreground = foreground;
        this.background = background;
    }
}

export default class Console {
    private static setColor(foreground?: Color, background?: Color): void {
        if (foreground) {
            process.stdout.write(foreground.foreground);
        }
        if (background) {
            process.stdout.write(background.background);
        }
    }

    private static resetColor(): void {
        process.stdout.write(Console.RESET.foreground);
    }

    public static write(message: any, foreground?: Color, background?: Color): void {
        this.setColor(foreground, background);
        process.stdout.write(message);
        this.resetColor();
    }

    public static writeLine(message: any, foreground?: Color, background?: Color): void {
        this.setColor(foreground, background);
        process.stdout.write(message);
        process.stdout.write(os.EOL);
        this.resetColor();
    }

    private static writeTag(tag: string, foreground?: Color, background?: Color): void {
        this.write("[");
        this.setColor(foreground, background);
        this.write(tag);
        this.resetColor();
        this.write("]: ");
    }

    public static writeFetch(message: string): void {
        this.writeTag("Fetch", Console.DARK_GREEN);
        this.writeLine(message);
    }

    public static writeError(message: string): void {
        this.writeTag("Error", Console.DARK_RED);
        this.writeLine(message);
    }

    public static writeInfo(message: string): void {
        this.writeTag("Info", Console.BRIGHT_BLUE);
        this.writeLine(message);
    }

    public static RESET: Color = new Color("\x1b[0m", "\x1b[0m");
    public static BLACK: Color = new Color("\x1b[30m", "\x1b[40m");
    public static DARK_RED: Color = new Color("\x1b[31m", "\x1b[41m");
    public static DARK_GREEN: Color = new Color("\x1b[32m", "\x1b[42m");
    public static DARK_YELLOW: Color = new Color("\x1b[33m", "\x1b[43m");
    public static DARK_BLUE: Color = new Color("\x1b[34m", "\x1b[44m");
    public static DARK_MAGENTA: Color = new Color("\x1b[35m", "\x1b[45m");
    public static DARK_CYAN: Color = new Color("\x1b[36m", "\x1b[46m");
    public static DARK_WHITE: Color = new Color("\x1b[37m", "\x1b[47m");

    public static BRIGHT_BLACK: Color = new Color("\x1b[90m", "\x1b[100m");
    public static BRIGHT_RED: Color = new Color("\x1b[91m", "\x1b[101m");
    public static BRIGHT_GREEN: Color = new Color("\x1b[92m", "\x1b[102m");
    public static BRIGHT_YELLOW: Color = new Color("\x1b[93m", "\x1b[103m");
    public static BRIGHT_BLUE: Color = new Color("\x1b[94m", "\x1b[104m");
    public static BRIGHT_MAGENTA: Color = new Color("\x1b[95m", "\x1b[105m");
    public static BRIGHT_CYAN: Color = new Color("\x1b[96m", "\x1b[106m");
    public static WHITE: Color = new Color("\x1b[97m", "\x1b[107m");
}