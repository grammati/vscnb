// https://observablehq.com/@tmcw/hello-world@7
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer("hello")).define("hello", ["md", "name"], function (md, name) {
    return (
      md `# Hello ${name}`
    )
  });
  main.variable(observer("name")).define("name", function () {
    return (
      'world'
    )
  });
  return main;
}