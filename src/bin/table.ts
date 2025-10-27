import * as os from "os";

export class Table {
    private readonly columns: number;
    private readonly rows: any[][];

    public constructor(columns: number) {
        this.columns = columns;
        this.rows = [];
    }

    public addRow(...row: any[]): void {
        if (row.length != this.columns) {
            throw "Wrong column size";
        }

        this.rows.push(row);
    }

    private calcColumnSize(col: number): number {
        let maxWidth: number = 0;
        for (const row of this.rows) {
            const item: string = row[col].toString();
            maxWidth = Math.max(item.toString().length + 1, maxWidth);
        }

        return maxWidth;
    }

    private calcColumnSizeMap(): number[] {
        const map: number[] = [];
        for (let i: number = 0; i < this.columns; i++) {
            map.push(this.calcColumnSize(i));
        }

        return map;
    }

    public toString(): string {
        const sizeMap: number[] = this.calcColumnSizeMap();
        let table: string = "";

        for (const row of this.rows) {
            for (let i: number = 0; i < this.columns; i++) {
                if (i > 0) {
                    table += " ";
                }

                table += row[i].toString().padEnd(sizeMap[i], " ");
            }

            table += os.EOL;
        }

        return table;
    }
}