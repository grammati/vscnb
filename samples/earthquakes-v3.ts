// https://beta.observablehq.com/@jashkenas/earthquakes@74
import { Runtime, ObserverFactory } from "@observablehq/runtime";

export default function define(runtime: Runtime, observer: ObserverFactory) {
  const main = runtime.module();
  main.variable(observer("s")).define("s", function() {
    return 450;
  });
  main.variable(observer("radius")).define("radius", ["s"], function(s) {
    return s / 2;
  });
  main
    .variable(observer("globe"))
    .define(
      "globe",
      [
        "DOM",
        "s",
        "d3",
        "radius",
        "rotation",
        "world",
        "quakeColor",
        "quakeRadius",
        "quakes"
      ],
      function(
        DOM,
        s,
        d3,
        radius,
        rotation,
        world,
        quakeColor,
        quakeRadius,
        quakes
      ) {
        var c = DOM.context2d(s, s);
        var canvas = c.canvas;

        var projection = d3
          .geoOrthographic()
          .scale(radius)
          .translate([s / 2, s / 2]);
        projection.rotate([rotation, 0]);
        var path = d3.geoPath(projection, c);

        // Draw the seas.
        c.lineWidth = 1.5;
        c.fillStyle = "aliceblue";
        c.beginPath(),
          c.arc(s / 2, s / 2, radius, 0, 2 * Math.PI),
          c.fill(),
          c.stroke();

        // Draw the land.
        c.lineWidth = 0.35;
        c.fillStyle = "mintcream";
        c.beginPath(), path(world), c.fill(), c.stroke();

        // Draw the earthquakes.
        let color = d3.color(quakeColor);
        color.opacity = 0.25;
        c.fillStyle = color;
        path.pointRadius(quakeRadius);
        quakes.features.forEach(quake => {
          c.beginPath(), path(quake), c.fill();
        });

        return canvas;
      }
    );
  main
    .variable(observer("viewof rotation"))
    .define("viewof rotation", ["DOM"], function(DOM) {
      var rotation = DOM.range(0, 360, 1);
      rotation.value = 90;
      return rotation;
    });
  main
    .variable(observer("rotation"))
    .define("rotation", ["Generators", "viewof rotation"], (G, _) =>
      G.input(_)
    );
  main
    .variable(observer("viewof quakeSize"))
    .define("viewof quakeSize", ["DOM"], function(DOM) {
      return DOM.range(0, 12);
    });
  main
    .variable(observer("quakeSize"))
    .define("quakeSize", ["Generators", "viewof quakeSize"], (G, _) =>
      G.input(_)
    );
  main
    .variable(observer("viewof quakeColor"))
    .define("viewof quakeColor", ["DOM"], function(DOM) {
      var input = DOM.input("color");
      input.value = "#ff0000";
      return input;
    });
  main
    .variable(observer("quakeColor"))
    .define("quakeColor", ["Generators", "viewof quakeColor"], (G, _) =>
      G.input(_)
    );
  main
    .variable(observer("quakeRadius"))
    .define("quakeRadius", ["d3", "quakeSize"], function(d3, quakeSize) {
      const scale = d3
        .scaleSqrt()
        .domain([0, 100])
        .range([0, quakeSize]);
      return function(quake) {
        return scale(Math.exp(quake.properties.mag));
      };
    });
  main.variable(observer("url")).define("url", function() {
    return "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  });
  main
    .variable(observer("quakes"))
    .define("quakes", ["url"], async function(url) {
      return (await fetch(url)).json();
    });
  main
    .variable(observer("exampleQuake"))
    .define("exampleQuake", ["quakes"], function(quakes) {
      return quakes.features[30].properties;
    });
  main
    .variable(observer("world"))
    .define("world", ["topojson"], async function(topojson) {
      var world = await (await fetch(
        "https://unpkg.com/world-atlas@1/world/110m.json"
      )).json();
      return topojson.feature(world, world.objects.countries);
    });
  main
    .variable(observer("topojson"))
    .define("topojson", ["require"], function(require) {
      return require("topojson");
    });
  main.variable(observer("d3")).define("d3", ["require"], function(require) {
    return require("d3");
  });
  return main;
}
