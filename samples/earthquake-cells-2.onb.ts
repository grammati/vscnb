// Hypothetical format with explicit wrapping of code into "cell" objects, "viewof" objects
import { md, DOM } from "@observablehq/runtime";
import * as d3 from "d3";
import * as topojson from "topojson";
import { cell, defcell, viewof } from "../onb";
import { Point, GeoJsonGeometryTypes } from "geojson";

//%%
md`
# Earthquakes!

This notebook contains all the code from [the example screencast](https://www.youtube.com/watch?v=uEmDwflQ3xE). Play along as you watch, or fork it for yourself. Or check out a [more sophisticated version](https://beta.observablehq.com/@jashkenas/quakespotter-0-1).
`;

//%%
const s = 450;

//%%
const radius = 225;

//%%
defcell(() => (rotation) => (rotation) => rotation * 2);

//%% globe
defcell(() => (rotation, world, quakeColor, quakeRadius, quakes) =>
    (
      rotation: number,
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
      c.beginPath();
      c.arc(s / 2, s / 2, radius, 0, 2 * Math.PI);
      c.fill();
      c.stroke();

      // Draw the land.
      c.lineWidth = 0.35;
      c.fillStyle = "mintcream";
      c.beginPath();
      path(world);
      c.fill();
      c.stroke();

      // Draw the earthquakes.
      let color = d3.color(quakeColor);
      if (color) {
        color.opacity = 0.25;
        c.fillStyle = color.toString();
      }
      path.pointRadius(quakeRadius);
      quakes.features.forEach(quake => {
        c.beginPath();
        path(quake);
        c.fill();
      });

      return canvas;
    }
  );

//%%
const rotation = viewof(() => {
  var rotation = DOM.range(0, 360, 1);
  rotation.value = "90";
  return rotation;
});

//%% viewof
const quakeSize = DOM.range(0, 12);

//%% viewof
const quakeColor = viewof(() => {
  var input = DOM.input("color");
  input.value = "#ff0000";
  return input;
});

//%%
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

//%%
const quakeRadius = cell(() => {
  const scale = d3
    .scaleSqrt()
    .domain([0, 100])
    .range([0, parseInt(quakeSize.value)]);
  return function(quake: Quake) {
    return scale(Math.exp(quake.properties.mag));
  };
});

//%%
const url =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//%%
const quakes = (async () => {
  return (await (await fetch(url)).json()) as Quakes;
})();

//%%
const exampleQuake = (async () => {
  return (await quakes).features[30].properties;
})();

//%%
const world = async () => {
  var world = await (await fetch(
    "https://unpkg.com/world-atlas@1/world/110m.json"
  )).json();
  return await topojson.feature(world, world.objects.countries);
};

//%%
