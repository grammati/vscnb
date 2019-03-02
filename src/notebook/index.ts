import { Runtime, Inspector } from "@observablehq/runtime";

const notebook = {
  id: "kljdflakdl",
  modules: [
    {
      id: "oefdlkfadlfa",
      variables: [
        {
          name: "x",
          value: () => 23
        },
        {
          name: "y",
          inputs: ["x"],
          value: (x: number) => x * 2
        }
      ]
    }
  ]
};

export function getModule() {
  const runtime = new Runtime();
  const module = runtime.module();
  const observer = Inspector.into(document.querySelector("#content2")!);
  const x = module.variable(observer("x")).define("x", [], function() {
    return 40;
  });
  module.variable(observer("y")).define("y", ["x"], function(x: number) {
    return x + 2;
  });
  module
    .variable(observer("hello"))
    .define("hello", ["md", "name"], function(md, name) {
      return md`# Hello ${name}`;
    });
  module.variable(observer("name")).define("name", function() {
    return "world";
  });
  return module;
}

getModule();