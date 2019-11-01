// URL: https://observablehq.com/@mbostock/fullscreen-canvas
// Title: Fullscreen Canvas
// Author: Mike Bostock (@mbostock)
// Version: 81
// Runtime version: 1

const m0 = {
  id: "fe9ad230801481be@81",
  variables: [
    {
      inputs: ["md"],
      value: function(md) {
        return md`
# Fullscreen Canvas

The trick is to make the cell’s _container_ element go fullscreen, not the cell’s content. Here I’m reaching through the DOM to find the container element of the following cell, which also prevents the button from re-rendering reactively.
        `;
      }
    },
    {
      name: "fullscreen",
      inputs: ["html"],
      value: function(html) {
        const button = html`
          <button>Fullscreen</button>
        `;
        button.onclick = () =>
          button.parentElement.nextElementSibling.requestFullscreen();
        return button;
      }
    },
    {
      name: "canvas",
      inputs: ["width", "screen", "DOM", "d3"],
      value: function*(width, screen, DOM, d3) {
        const n = 200;
        const height = Math.ceil((width * screen.height) / screen.width);
        const margin = 60;
        const context = DOM.context2d(width, height);
        const particles = Array.from({ length: n }, () => [
          Math.random() * width,
          Math.random() * height,
          0,
          0
        ]);
        context.canvas.style.background = "#fff";
        context.strokeStyle = "red";
        while (true) {
          const delaunay = new d3.Delaunay.from(particles);
          const voronoi = delaunay.voronoi([0, 0, width, height]);
          context.save();
          context.clearRect(0, 0, width, height);
          context.beginPath();
          delaunay.renderPoints(context);
          context.fill();
          context.beginPath();
          voronoi.render(context);
          context.stroke();
          yield context.canvas;
          for (const p of particles) {
            p[0] += p[2];
            p[1] += p[3];
            if (p[0] < -margin) {
              p[0] += width + margin * 2;
            } else if (p[0] > width + margin) {
              p[0] -= width + margin * 2;
            }
            if (p[1] < -margin) {
              p[1] += height + margin * 2;
            } else if (p[1] > height + margin) {
              p[1] -= height + margin * 2;
            }
            p[2] += 0.2 * (Math.random() - 0.5) - 0.01 * p[2];
            p[3] += 0.2 * (Math.random() - 0.5) - 0.01 * p[3];
          }
        }
      }
    },
    {
      name: "d3",
      inputs: ["require"],
      value: function(require) {
        return require("d3-delaunay@4");
      }
    }
  ]
};

const notebook = {
  id: "fe9ad230801481be@81",
  modules: [m0]
};

export default notebook;
