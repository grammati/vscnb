import { Runtime, Inspector, Library } from "@observablehq/runtime";
import { Point, GeoJsonGeometryTypes } from "geojson";

const { md, DOM, Generators } = new Library();

import * as d3 from "d3";
import * as topojson from "topojson";

interface Quake {
  properties: {
    mag: number;
  };
  geometry: Point;
  type: GeoJsonGeometryTypes;
}
interface Quakes {
  features: Quake[];
}

const runtime = new Runtime();
const module = runtime.module();
const observer = Inspector.into("#content");

//%%
module.variable(observer("md")).define(md`
# Earthquakes!

This notebook contains all the code from [the example screencast](https://www.youtube.com/watch?v=uEmDwflQ3xE). Play along as you watch, or fork it for yourself. Or check out a [more sophisticated version](https://beta.observablehq.com/@jashkenas/quakespotter-0-1).
`);

//%%
module.variable(observer("s")).define("s", [], 450);

//%%
module.variable(observer("radius")).define("radius", [], 225);

//%%
module
  .variable(observer("globe"))
  .define(
    "globe",
    ["s", "rotation", "radius", "world", "quakeColor", "quakeRadius", "quakes"],
    (
      s: number,
      rotation: number,
      radius: number,
      world: d3.GeoPermissibleObjects,
      quakeColor: string,
      quakeRadius: number,
      quakes: Quakes
    ) => {
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
      if (color) {
        color.opacity = 0.25;
        c.fillStyle = color.toString();
      }
      path.pointRadius(quakeRadius);
      quakes.features.forEach(quake => {
        c.beginPath(), path(quake), c.fill();
      });

      return canvas;
    }
  );

//%%
module.variable(observer("viewof rotation")).define("viewof rotation", () => {
  const rotation = DOM.range(0, 360, 1);
  rotation.value = "90";
  return rotation;
});
module
  .variable(observer("rotation"))
  .define("rotation", ["viewof rotation"], (rotation: HTMLInputElement) =>
    Generators.input(rotation)
  );

//%%
module
  .variable(observer("viewof quakeSize"))
  .define("viewof quakeSize", DOM.range(0, 12));
module
  .variable()
  .define("quakeSize", ["viewof quakeSize"], (qs: HTMLInputElement) =>
    Generators.input(qs)
  );

//%%
module
  .variable(observer("viewof quakeColor"))
  .define("viewof quakeColor", () => {
    var input = DOM.input("color");
    input.value = "#ff0000";
    return input;
  });
module
  .variable()
  .define("quakeColor", ["viewof quakeColor"], (qc: HTMLInputElement) =>
    Generators.input(qc)
  );

//%%
module
  .variable(observer("quakeRadius"))
  .define("quakeRadius", ["quakeSize"], (quakeSize: number) => {
    const scale = d3
      .scaleSqrt()
      .domain([0, 100])
      .range([0, quakeSize]);
    return function(quake: Quake) {
      return scale(Math.exp(quake.properties.mag));
    };
  });

//%%
const url =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//%%
module.variable(observer("quakes")).define("quakes", async () => {
  return (await fetch(url)).json() as Promise<Quakes>;
});

//%%
module
  .variable(observer("exampleQuake"))
  .define(
    "exampleQuake",
    ["quakes"],
    (quakes: Quakes) => quakes.features[30].properties
  );

//%%
module.variable(observer("world")).define("world", async () => {
  const world = await (await fetch(
    "https://unpkg.com/world-atlas@1/world/110m.json"
  )).json();
  return topojson.feature(world, world.objects.countries);
});

export default module;
