import * as d3 from 'd3';
import { DOM } from '@observablehq/stdlib'

async function* foo(width: number) {
  const w = Math.min(640, width);
  const h = 320;
  const r = 20;
  const t = 1500;
  const svg = d3.select(DOM.svg(w, h));
  const circle = svg
    .append("circle")
    .attr("r", r)
    .attr("cx", w / 4)
    .attr("cy", h / 4);
  while (true) {
    yield svg.node();
    await circle
      .transition()
      .duration(t)
      .attr("cy", (h * 3) / 4)
      .end();
    await circle
      .transition()
      .duration(t)
      .attr("cx", (w * 3) / 4)
      .end();
    await circle
      .transition()
      .duration(t)
      .attr("cy", (h * 1) / 4)
      .end();
    await circle
      .transition()
      .duration(t)
      .attr("cx", (w * 1) / 4)
      .end();
  }
}
