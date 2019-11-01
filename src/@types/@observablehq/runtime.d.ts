declare module "@observablehq/runtime" {
  class Library {
   md(s: TemplateStringsArray): void;
    DOM: {
      context2d: (
        width: number,
        height: number,
        dpi?: number
      )=> CanvasRenderingContext2D;
      input: (type: string)=> HTMLInputElement;
      range: (min: number, max: number, step?: number)=> HTMLInputElement;
      svg: (width: number, height: number)=> SVGSVGElement;
    }

    Generators: {
      input: (elt: HTMLInputElement)=> IterableIterator<string>;
    }
  }

  class Runtime {
    module(
      define?: DefineFn | null,
      observerFactory?: ObserverFactory
    ): IModule;
  }

  type ObserverFactory = (name: string) => IObserver | undefined;

  class Inspector {
    constructor(node: any);
    pending(): void;
    fulfilled(value: any): void;
    rejected(error: Error): void;
    static into(container: string | Element): ObserverFactory;
  }

  type DefineFn = (runtime: Runtime, observer: IObserver) => IModule;

  interface IObserver {
    pending(): void;
    fulfilled(value: any): void;
    rejected(error: Error): void;
  }

  interface IModule {
    variable(observer?: IObserver): IVariable<any>;
  }

  type F<T> = T | ((...args: any[]) => T);

  interface IVariable<T> {
    // Definition only (anonymous, no inputs)
    define(definition: F<T>): IVariable<T>;

    // Name and Definition (no inputs)
    define(name: string, definition: F<T>): IVariable<T>;

    // Inputs and Definition (anonymous)
    define(inputs: string[], definition: F<T>): IVariable<T>;

    // All 3
    define(name: string, inputs: string[], definition: F<T>): IVariable<T>;

    import(name: string, module: IModule): IVariable<T>;
    import(name: string, alias: string, module: IModule): IVariable<T>;
  }
}
