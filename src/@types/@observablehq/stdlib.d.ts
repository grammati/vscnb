declare module "@observablehq/stdlib" {
  function md(s: TemplateStringsArray): void;

  namespace DOM {
    function context2d(
      width: number,
      height: number,
      dpi?: number
    ): CanvasRenderingContext2D;
    function input(type: string): HTMLInputElement;
    function range(min: number, max: number, step?: number): HTMLInputElement;
    function svg(width: number, height: number): SVGSVGElement;
  }

  namespace Generators {
    function input(elt: HTMLInputElement): IterableIterator<string>;
  }
}
