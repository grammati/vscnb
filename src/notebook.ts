import {Runtime, Inspector} from '@observablehq/runtime';

export function getModule() {
  const runtime = new Runtime();
  const module = runtime.module();
  const observer = Inspector.into('content');
  const x = module.variable(observer("x")).define("x", [], function() {
    return 40;
  });
  module.variable(observer("y")).define("y", ["x"], function(x: number) {
    return x + 2;
  });
  return module;
}
