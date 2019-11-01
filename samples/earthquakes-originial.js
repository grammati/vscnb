// URL: https://observablehq.com/@jashkenas/earthquakes
// Title: Earthquakes!
// Author: Jeremy Ashkenas (@jashkenas)
// Version: 74
// Runtime version: 1

const m0 = {
  id: "aa324bd37a00d540@74",
  variables: [
    {
      inputs: ["md"],
      value: function(md) {
        return md`
# Earthquakes!

This notebook contains all the code from [the example screencast](https://www.youtube.com/watch?v=uEmDwflQ3xE). Play along as you watch, or fork it for yourself. Or check out a [more sophisticated version](https://beta.observablehq.com/@jashkenas/quakespotter-0-1).
        `;
      }
    },
    {
      name: "s",
      value: function() {
        return 450;
      }
    },
    {
      name: "radius",
      inputs: ["s"],
      value: function(s) {
        return s / 2;
      }
    },
    {
      name: "globe",
      inputs: [
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
      value: function(
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
    },
    {
      name: "viewof rotation",
      inputs: ["DOM"],
      value: function(DOM) {
        var rotation = DOM.range(0, 360, 1);
        rotation.value = 90;
        return rotation;
      }
    },
    {
      name: "rotation",
      inputs: ["Generators", "viewof rotation"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof quakeSize",
      inputs: ["DOM"],
      value: function(DOM) {
        return DOM.range(0, 12);
      }
    },
    {
      name: "quakeSize",
      inputs: ["Generators", "viewof quakeSize"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof quakeColor",
      inputs: ["DOM"],
      value: function(DOM) {
        var input = DOM.input("color");
        input.value = "#ff0000";
        return input;
      }
    },
    {
      name: "quakeColor",
      inputs: ["Generators", "viewof quakeColor"],
      value: (G, _) => G.input(_)
    },
    {
      name: "quakeRadius",
      inputs: ["d3", "quakeSize"],
      value: function(d3, quakeSize) {
        const scale = d3
          .scaleSqrt()
          .domain([0, 100])
          .range([0, quakeSize]);
        return function(quake) {
          return scale(Math.exp(quake.properties.mag));
        };
      }
    },
    {
      name: "url",
      value: function() {
        return "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
      }
    },
    {
      name: "quakes",
      inputs: ["url"],
      value: async function(url) {
        return (await fetch(url)).json();
      }
    },
    {
      name: "exampleQuake",
      inputs: ["quakes"],
      value: function(quakes) {
        return quakes.features[30].properties;
      }
    },
    {
      name: "world",
      inputs: ["topojson"],
      value: async function(topojson) {
        var world = await (await fetch(
          "https://unpkg.com/world-atlas@1/world/110m.json"
        )).json();
        return topojson.feature(world, world.objects.countries);
      }
    },
    {
      name: "topojson",
      inputs: ["require"],
      value: function(require) {
        return require("topojson");
      }
    },
    {
      name: "d3",
      inputs: ["require"],
      value: function(require) {
        return require("d3");
      }
    }
  ]
};

const notebook = {
  id: "aa324bd37a00d540@74",
  modules: [m0]
};

export default notebook;
