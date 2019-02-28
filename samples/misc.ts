import { Runtime, Inspector, IVariable } from "@observablehq/runtime";
import earthquakes from "./samples/earthquakes";

class App {
  v!: IVariable;

  foo() {
    const runtime = new Runtime();
    const inspector = new Inspector(document.querySelector("#app"));
    earthquakes;

    const mod = runtime.module();
    mod.variable().define("a", 1);
    this.v = mod.variable().define("b", 2);
    mod
      .variable(inspector)
      .define("c", ["a", "b"], (a: number, b: number) => a + b);
  }
}
