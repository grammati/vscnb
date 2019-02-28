import {md, DOM} from '@observablehq/runtime';
import * as d3 from 'd3';

//%%
md`# Earthquakes!

This notebook contains all the code from [the example screencast](https://www.youtube.com/watch?v=uEmDwflQ3xE). Play along as you watch, or fork it for yourself. Or check out a [more sophisticated version](https://beta.observablehq.com/@jashkenas/quakespotter-0-1).`;


//%%
const s = 450;

//%%
const radius = 225;

//%%
const globe = () => {
  var c = DOM.context2d(s, s);
  var canvas = c.canvas;
  
  var projection = d3.geoOrthographic().scale(radius).translate([s / 2, s / 2]);
  projection.rotate([rotation, 0]);
  var path = d3.geoPath(projection, c);
  
  // Draw the seas.
  c.lineWidth = 1.5;
  c.fillStyle = "aliceblue";
  c.beginPath(), c.arc(s / 2, s / 2, radius, 0, 2 * Math.PI), c.fill(), c.stroke();
  
  // Draw the land.
  c.lineWidth = 0.35;
  c.fillStyle = "mintcream";
  c.beginPath(), path(world), c.fill(), c.stroke();
  
  // Draw the earthquakes.
  let color = d3.color(quakeColor);
  color.opacity = 0.25;
  c.fillStyle = color;
  path.pointRadius(quakeRadius);
  quakes.features.forEach(quake => {c.beginPath(), path(quake), c.fill();});
  
  return canvas;
}

//%% viewof
const rotation = () => {
  var rotation = DOM.range(0, 360, 1);
  rotation.value = 90;
  return rotation
}