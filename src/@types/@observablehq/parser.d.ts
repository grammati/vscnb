declare module "@observablehq/parser" {
    interface Cell {
        async: boolean;
        start: number;
        end: number;
        
    }
    function parseCell(code: string): Cell;
}