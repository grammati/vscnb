// https://beta.observablehq.com/@jashkenas/quakespotter-0-1@1050
import define1 from "../@jashkenas/inputs.js?v=3";

export default function define(runtime, observer) {
  const main = runtime.module();
  main
    .variable(observer("globe"))
    .define(
      "globe",
      [
        "DOM",
        "w",
        "d3",
        "quakeColor",
        "quakeOpacity",
        "r",
        "spinSpeed",
        "oceanColor",
        "lineWidth",
        "landColor",
        "earth",
        "dots",
        "quakeCircles",
        "quakes",
        "magnitudeRadius"
      ],
      function*(
        DOM,
        w,
        d3,
        quakeColor,
        quakeOpacity,
        r,
        spinSpeed,
        oceanColor,
        lineWidth,
        landColor,
        earth,
        dots,
        quakeCircles,
        quakes,
        magnitudeRadius
      ) {
        // Set up the <canvas> to draw into.
        const context = this ? this.getContext("2d") : DOM.context2d(w, w);
        const canvas = context.canvas;
        canvas.angle = canvas.angle || 0;
        canvas.style.display = "block";
        canvas.style.margin = "auto";
        const color = d3.color(quakeColor);
        color.opacity = quakeOpacity;

        // Use an orthographic projection of the world. For fun, try changing `Ortho` to `Stereo`.
        const projection = d3
          .geoOrthographic()
          .scale(r)
          .translate([w / 2, w / 2]);
        const path = d3.geoPath(projection, context);

        // For every frame.
        while (true) {
          // Rotate the earth. For fun, try replacing the `0` in the following line with `canvas.angle`.
          projection.rotate([(canvas.angle += spinSpeed), 0]);
          context.clearRect(0, 0, w, w);

          // Draw the seas.
          context.lineWidth = 1.5;
          context.fillStyle = oceanColor;
          context.beginPath(),
            context.arc(w / 2, w / 2, r, 0, 2 * Math.PI),
            context.fill(),
            context.stroke();

          // Draw the land.
          context.lineWidth = lineWidth;
          context.fillStyle = landColor;
          context.beginPath(), path(earth), context.fill(), context.stroke();

          // Draw the earthquakes, either as projected circles on the surface, or flat circles in space.
          context.fillStyle = color;
          let circles = dots == "projected" ? quakeCircles : quakes.features;
          if (dots == "unprojected") path.pointRadius(magnitudeRadius);
          circles.forEach(d => {
            context.beginPath(), path(d);
            context.fill();
          });
          path.pointRadius(null);

          yield canvas;
        }
      }
    );
  main
    .variable(observer("viewof timeFrame"))
    .define("viewof timeFrame", ["DOM"], function(DOM) {
      const select = DOM.select(["past-day", "past-week", "past-month"]);
      select.value = "past-week";
      return select;
    });
  main
    .variable(observer("timeFrame"))
    .define("timeFrame", ["Generators", "viewof timeFrame"], (G, _) =>
      G.input(_)
    );
  main
    .variable(observer("viewof dots"))
    .define("viewof dots", ["DOM"], function(DOM) {
      return DOM.select(["projected", "unprojected"]);
    });
  main
    .variable(observer("dots"))
    .define("dots", ["Generators", "viewof dots"], (G, _) => G.input(_));
  main
    .variable(observer("viewof land"))
    .define("viewof land", ["DOM"], function(DOM) {
      return DOM.select(["countries", "land"]);
    });
  main
    .variable(observer("land"))
    .define("land", ["Generators", "viewof land"], (G, _) => G.input(_));
  main
    .variable(observer("viewof lineWidth"))
    .define("viewof lineWidth", ["slider"], function(slider) {
      return slider({
        min: 0.01,
        max: 5,
        value: 0.35
      });
    });
  main
    .variable(observer("lineWidth"))
    .define("lineWidth", ["Generators", "viewof lineWidth"], (G, _) =>
      G.input(_)
    );
  main
    .variable(observer("viewof quakeSize"))
    .define("viewof quakeSize", ["slider"], function(slider) {
      return slider({
        min: 1,
        max: 20,
        value: 10
      });
    });
  main
    .variable(observer("quakeSize"))
    .define("quakeSize", ["Generators", "viewof quakeSize"], (G, _) =>
      G.input(_)
    );
  main
    .variable(observer("viewof padding"))
    .define("viewof padding", ["slider"], function(slider) {
      return slider({
        min: 0,
        max: 100,
        value: 10
      });
    });
  main
    .variable(observer("padding"))
    .define("padding", ["Generators", "viewof padding"], (G, _) => G.input(_));
  main
    .variable(observer("viewof spinSpeed"))
    .define("viewof spinSpeed", ["slider"], function(slider) {
      return slider({
        min: 0,
        max: 3,
        value: 0.4
      });
    });
  main
    .variable(observer("spinSpeed"))
    .define("spinSpeed", ["Generators", "viewof spinSpeed"], (G, _) =>
      G.input(_)
    );
  main
    .variable(observer("viewof oceanColor"))
    .define("viewof oceanColor", ["color"], function(color) {
      return color({
        value: "#74fbfd"
      });
    });
  main
    .variable(observer("oceanColor"))
    .define("oceanColor", ["Generators", "viewof oceanColor"], (G, _) =>
      G.input(_)
    );
  main
    .variable(observer("viewof landColor"))
    .define("viewof landColor", ["color"], function(color) {
      return color({
        value: "#fefafa"
      });
    });
  main
    .variable(observer("landColor"))
    .define("landColor", ["Generators", "viewof landColor"], (G, _) =>
      G.input(_)
    );
  main
    .variable(observer("viewof quakeColor"))
    .define("viewof quakeColor", ["color"], function(color) {
      return color({
        value: "#f11707"
      });
    });
  main
    .variable(observer("quakeColor"))
    .define("quakeColor", ["Generators", "viewof quakeColor"], (G, _) =>
      G.input(_)
    );
  main
    .variable(observer("viewof quakeOpacity"))
    .define("viewof quakeOpacity", ["slider"], function(slider) {
      return slider({
        min: 0,
        max: 1,
        value: 0.25
      });
    });
  main
    .variable(observer("quakeOpacity"))
    .define("quakeOpacity", ["Generators", "viewof quakeOpacity"], (G, _) =>
      G.input(_)
    );
  main.variable(observer("urls")).define("urls", function() {
    return {
      "past-day":
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
      "past-week":
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson",
      "past-month":
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"
    };
  });
  main
    .variable(observer("quakes"))
    .define("quakes", ["urls", "timeFrame"], async function(urls, timeFrame) {
      return (await fetch(urls[timeFrame])).json();
    });
  main
    .variable(observer("quakeCircles"))
    .define("quakeCircles", ["d3", "quakes", "magnitudeRadius"], function(
      d3,
      quakes,
      magnitudeRadius
    ) {
      const circle = d3.geoCircle();
      return quakes.features.map(quake => {
        return circle
          .center(quake.geometry.coordinates)
          .radius(magnitudeRadius(quake) / 5)
          .precision(25)();
      });
    });
  main.variable(observer("world")).define("world", async function() {
    return (await fetch(
      "https://unpkg.com/world-atlas@1/world/110m.json"
    )).json();
  });
  main
    .variable(observer("earth"))
    .define("earth", ["topojson", "world", "land"], function(
      topojson,
      world,
      land
    ) {
      return topojson.feature(world, world.objects[land]);
    });
  main
    .variable(observer("magnitudeRadius"))
    .define("magnitudeRadius", ["d3", "quakeSize"], function(d3, quakeSize) {
      const scale = d3
        .scaleSqrt()
        .domain([0, 100])
        .range([0, quakeSize]);
      return function(quake) {
        return scale(Math.exp(quake.properties.mag));
      };
    });
  main
    .variable(observer("exampleQuakeData"))
    .define("exampleQuakeData", ["quakes"], function(quakes) {
      return quakes.features[30].properties;
    });
  main
    .variable(observer("exampleQuakeMagnitude"))
    .define(
      "exampleQuakeMagnitude",
      ["magnitudeRadius", "exampleQuakeData"],
      function(magnitudeRadius, exampleQuakeData) {
        return magnitudeRadius({
          properties: exampleQuakeData
        });
      }
    );
  main.variable(observer("w")).define("w", ["width"], function(width) {
    return Math.min(680, width);
  });
  main
    .variable(observer("r"))
    .define("r", ["w", "padding"], function(w, padding) {
      return w / 2 - 2 - padding;
    });
  const child1 = runtime.module(define1);
  main.variable(observer("slider")).import("slider", child1);
  main.variable(observer("color")).import("color", child1);
  main.variable(observer("d3")).define("d3", ["require"], function(require) {
    return require("d3@4");
  });
  main
    .variable(observer("topojson"))
    .define("topojson", ["require"], function(require) {
      return require("topojson-client@3");
    });
  return main;
}
