declare module "@observablehq/runtime" {

  class Runtime {
    module(define?: DefineFn|null, observerFactory?: ObserverFactory): IModule;
  }

  type ObserverFactory = (name: string) => IObserver|undefined;

  class Inspector implements IObserver {
    constructor(node: any);
    pending(): void;
    fulfilled(value: any): void;
    rejected(error: Error): void;
    into(container: string): (v: IVariable) => Inspector;
  }

  export type DefineFn = (runtime: Runtime, observer: IObserver) => IModule;

  export interface IObserver {
    pending(): void;
    fulfilled(value: any): void;
    rejected(error: Error): void;
  }

  export interface IModule {
    variable(observer?: IObserver): IVariable;
  }

  type VariableDefinition = any;

  export interface IVariable {
    _value: any;

    // Definition only (anonymous, no inputs)
    define(definition: VariableDefinition): IVariable;

    // Name and Definition (no inputs)
    define(name: string, definition: VariableDefinition): IVariable;

    // Inputs and Definition (anonymous)
    define(inputs: string[], definition: VariableDefinition): IVariable;

    // All 3
    define(
      name: string,
      inputs: string[],
      definition: VariableDefinition
    ): IVariable;

    import(name: string, module: IModule): IVariable;
    import(name: string, alias: string, module: IModule): IVariable;
  }
}