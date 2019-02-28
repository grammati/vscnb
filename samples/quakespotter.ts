// URL: https://beta.observablehq.com/@jashkenas/quakespotter-0-1
// Title: U.S.G.S. World Earthquake Map
// Author: Jeremy Ashkenas (@jashkenas)
// Version: 1050
// Runtime version: 1

const m0 = {
  id: "3a5c18fd2e0f8c77@1050",
  variables: [
    {
      inputs: ["md"],
      value: function(md) {
        return md`
# U.S.G.S. World Earthquake Map

_Revisiting an [old project](https://github.com/jashkenas/quakespotter) done with [Will Bailey](https://github.com/willbailey) in [Ruby-Processing](https://github.com/jashkenas/ruby-processing/wiki) in 2009._

The U.S. Geological Survey publishes [feeds of recently recorded earthquakes](https://earthquake.usgs.gov/earthquakes/feed/) for the past hour, day, week and month. They produce a few formats, including — conveniently for our purposes —[GeoJSON](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php).

In this notebook, we'll pull in the latest data from the USGS, and plot the locations of recent earthquakes on a globe, while exposing some tweakable parameters.

Try changing the parameters below the globe, or click \`globe\` in the margin below to expand the code that draws the Earth.
        `;
      }
    },
    {
      name: "globe",
      inputs: [
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
      value: function*(
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
    },
    {
      name: "viewof timeFrame",
      inputs: ["DOM"],
      value: function(DOM) {
        const select = DOM.select(["past-day", "past-week", "past-month"]);
        select.value = "past-week";
        return select;
      }
    },
    {
      name: "timeFrame",
      inputs: ["Generators", "viewof timeFrame"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof dots",
      inputs: ["DOM"],
      value: function(DOM) {
        return DOM.select(["projected", "unprojected"]);
      }
    },
    {
      name: "dots",
      inputs: ["Generators", "viewof dots"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof land",
      inputs: ["DOM"],
      value: function(DOM) {
        return DOM.select(["countries", "land"]);
      }
    },
    {
      name: "land",
      inputs: ["Generators", "viewof land"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof lineWidth",
      inputs: ["slider"],
      value: function(slider) {
        return slider({
          min: 0.01,
          max: 5,
          value: 0.35
        });
      }
    },
    {
      name: "lineWidth",
      inputs: ["Generators", "viewof lineWidth"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof quakeSize",
      inputs: ["slider"],
      value: function(slider) {
        return slider({
          min: 1,
          max: 20,
          value: 10
        });
      }
    },
    {
      name: "quakeSize",
      inputs: ["Generators", "viewof quakeSize"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof padding",
      inputs: ["slider"],
      value: function(slider) {
        return slider({
          min: 0,
          max: 100,
          value: 10
        });
      }
    },
    {
      name: "padding",
      inputs: ["Generators", "viewof padding"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof spinSpeed",
      inputs: ["slider"],
      value: function(slider) {
        return slider({
          min: 0,
          max: 3,
          value: 0.4
        });
      }
    },
    {
      name: "spinSpeed",
      inputs: ["Generators", "viewof spinSpeed"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof oceanColor",
      inputs: ["color"],
      value: function(color) {
        return color({
          value: "#74fbfd"
        });
      }
    },
    {
      name: "oceanColor",
      inputs: ["Generators", "viewof oceanColor"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof landColor",
      inputs: ["color"],
      value: function(color) {
        return color({
          value: "#fefafa"
        });
      }
    },
    {
      name: "landColor",
      inputs: ["Generators", "viewof landColor"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof quakeColor",
      inputs: ["color"],
      value: function(color) {
        return color({
          value: "#f11707"
        });
      }
    },
    {
      name: "quakeColor",
      inputs: ["Generators", "viewof quakeColor"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof quakeOpacity",
      inputs: ["slider"],
      value: function(slider) {
        return slider({
          min: 0,
          max: 1,
          value: 0.25
        });
      }
    },
    {
      name: "quakeOpacity",
      inputs: ["Generators", "viewof quakeOpacity"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["md"],
      value: function(md) {
        return md`
**Note:** For the past month of earthquakes, we're using the URL that only includes quakes of [magnitude](https://earthquake.usgs.gov/learn/topics/measure.php) 2.5 and greater — to avoid bogging down the globe with too many dots. Below, try changing \`2.5\` to \`all\` to see the difference.
        `;
      }
    },
    {
      name: "urls",
      value: function() {
        return {
          "past-day":
            "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
          "past-week":
            "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson",
          "past-month":
            "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"
        };
      }
    },
    {
      inputs: ["md"],
      value: function(md) {
        return md`
Load the [GeoJSON](http://geojson.org/) from the url specified by the \`timeFrame\` variable. You can expand the object below to explore the full data available.
        `;
      }
    },
    {
      name: "quakes",
      inputs: ["urls", "timeFrame"],
      value: async function(urls, timeFrame) {
        return (await fetch(urls[timeFrame])).json();
      }
    },
    {
      inputs: ["md"],
      value: function(md) {
        return md`
For the \`projected\` option, use d3.geoCircle to project the quakes as circles on the surface of a sphere instead of just points.
        `;
      }
    },
    {
      name: "quakeCircles",
      inputs: ["d3", "quakes", "magnitudeRadius"],
      value: function(d3, quakes, magnitudeRadius) {
        const circle = d3.geoCircle();
        return quakes.features.map(quake => {
          return circle
            .center(quake.geometry.coordinates)
            .radius(magnitudeRadius(quake) / 5)
            .precision(25)();
        });
      }
    },
    {
      inputs: ["md"],
      value: function(md) {
        return md`
Load simplified shapes for land and country borders.
        `;
      }
    },
    {
      name: "world",
      value: async function() {
        return (await fetch(
          "https://unpkg.com/world-atlas@1/world/110m.json"
        )).json();
      }
    },
    {
      inputs: ["md"],
      value: function(md) {
        return md`
From the world data, select whether we want to draw country borders, or just all the land.
        `;
      }
    },
    {
      name: "earth",
      inputs: ["topojson", "world", "land"],
      value: function(topojson, world, land) {
        return topojson.feature(world, world.objects[land]);
      }
    },
    {
      inputs: ["md"],
      value: function(md) {
        return md`
Our totally subjective function mapping quake magnitude to circle size.
        `;
      }
    },
    {
      name: "magnitudeRadius",
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
      inputs: ["md"],
      value: function(md) {
        return md`
Pull out the properties of one earthquake, just so that we can see what we're working with. If you reload the page, this value may change, as the underlying data is frequently updated.
        `;
      }
    },
    {
      name: "exampleQuakeData",
      inputs: ["quakes"],
      value: function(quakes) {
        return quakes.features[30].properties;
      }
    },
    {
      name: "exampleQuakeMagnitude",
      inputs: ["magnitudeRadius", "exampleQuakeData"],
      value: function(magnitudeRadius, exampleQuakeData) {
        return magnitudeRadius({
          properties: exampleQuakeData
        });
      }
    },
    {
      inputs: ["md"],
      value: function(md) {
        return md`
The size of the globe can be responsive to the width of the notebook. Try narrowing your browser window.
        `;
      }
    },
    {
      name: "w",
      inputs: ["width"],
      value: function(width) {
        return Math.min(680, width);
      }
    },
    {
      name: "r",
      inputs: ["w", "padding"],
      value: function(w, padding) {
        return w / 2 - 2 - padding;
      }
    },
    {
      inputs: ["md"],
      value: function(md) {
        return md`
Finally — in order of prose, but not in order of evaluation — load the libraries we depend upon.
        `;
      }
    },
    {
      from: "@jashkenas/inputs",
      name: "slider",
      remote: "slider"
    },
    {
      from: "@jashkenas/inputs",
      name: "color",
      remote: "color"
    },
    {
      name: "d3",
      inputs: ["require"],
      value: function(require) {
        return require("d3@4");
      }
    },
    {
      name: "topojson",
      inputs: ["require"],
      value: function(require) {
        return require("topojson-client@3");
      }
    }
  ]
};

const m1 = {
  id: "@jashkenas/inputs",
  variables: [
    {
      name: "slider",
      inputs: ["input"],
      value: function(input) {
        return function slider(config = {}) {
          let {
            value,
            min = 0,
            max = 1,
            step = "any",
            precision = 2,
            title,
            description,
            getValue,
            format,
            display,
            submit
          } = config;
          if (typeof config == "number") value = config;
          if (value == null) value = (max + min) / 2;
          precision = Math.pow(10, precision);
          if (!getValue)
            getValue = input =>
              Math.round(input.valueAsNumber * precision) / precision;
          return input({
            type: "range",
            title,
            description,
            submit,
            format,
            display,
            attributes: {
              min,
              max,
              step,
              value
            },
            getValue
          });
        };
      }
    },
    {
      name: "color",
      inputs: ["input"],
      value: function(input) {
        return function color(config = {}) {
          let { value, title, description, submit, display } = config;
          if (typeof config == "string") value = config;
          if (value == null) value = "#000000";
          const form = input({
            type: "color",
            title,
            description,
            submit,
            display,
            attributes: {
              value
            }
          });
          if (title || description) form.input.style.margin = "5px 0";
          return form;
        };
      }
    },
    {
      name: "input",
      inputs: ["html", "d3format"],
      value: function(html, d3format) {
        return function input(config) {
          let {
            form,
            type = "text",
            attributes = {},
            action,
            getValue,
            title,
            description,
            format,
            display,
            submit,
            options
          } = config;
          if (!form)
            form = html`
              <form>
                <input name="input" type=${type} />
              </form>
            `;
          const input = form.input;
          Object.keys(attributes).forEach(key => {
            const val = attributes[key];
            if (val != null) input.setAttribute(key, val);
          });
          if (submit)
            form.append(
              html`
                <input
                  name="submit"
                  type="submit"
                  style="margin: 0 0.75em"
                  value="${typeof submit == "string" ? submit : "Submit"}"
                />
              `
            );
          form.append(
            html`
              <output
                name="output"
                style="font: 14px Menlo, Consolas, monospace; margin-left: 0.5em;"
              ></output>
            `
          );
          if (title)
            form.prepend(
              html`
                <div style="font: 700 0.9rem sans-serif;">${title}</div>
              `
            );
          if (description)
            form.append(
              html`
                <div style="font-size: 0.85rem; font-style: italic;">
                  ${description}
                </div>
              `
            );
          if (format) format = d3format.format(format);
          if (action) {
            action(form);
          } else {
            const verb = submit
              ? "onsubmit"
              : type == "button"
              ? "onclick"
              : type == "checkbox" || type == "radio"
              ? "onchange"
              : "oninput";
            form[verb] = e => {
              e && e.preventDefault();
              const value = getValue ? getValue(input) : input.value;
              if (form.output)
                form.output.value = display
                  ? display(value)
                  : format
                  ? format(value)
                  : value;
              form.value = value;
              if (verb !== "oninput")
                form.dispatchEvent(
                  new CustomEvent("input", {
                    bubbles: true
                  })
                );
            };
            if (verb !== "oninput")
              input.oninput = e =>
                e && e.stopPropagation() && e.preventDefault();
            if (verb !== "onsubmit")
              form.onsubmit = e => e && e.preventDefault();
            form[verb]();
          }
          return form;
        };
      }
    },
    {
      name: "d3format",
      inputs: ["require"],
      value: function(require) {
        return require("d3-format@1");
      }
    }
  ]
};

const notebook = {
  id: "3a5c18fd2e0f8c77@1050",
  modules: [m0, m1]
};

export default notebook;
