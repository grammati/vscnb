// URL: https://observablehq.com/@observablehq/introduction-to-asynchronous-iteration
// Title: Introduction to Asynchronous Iteration
// Author: Observable (@observablehq)
// Version: 500
// Runtime version: 1

const m0 = {
  id: "417ace5e790eb84c@500",
  variables: [
    {
      inputs: ["md"],
      value: function(md) {
        return md`
# Introduction to Asynchronous Iteration

<figure><img src="https://user-images.githubusercontent.com/230541/36046184-efb8ff7e-0d8c-11e8-8a62-ea03f50774a7.jpg" title="The Persistence of Memory (1931)"><figcaption>Image: [Salvador Dali](https://en.wikipedia.org/wiki/The_Persistence_of_Memory)</figcaption></figure>

Observable now supports [asynchronous iteration](http://2ality.com/2016/10/asynchronous-iteration.html), an exciting new feature of ES2018 that was [finalized last month](http://2ality.com/2017/02/ecmascript-2018.html) by TC39! You’ll need a [very recent browser](http://kangax.github.io/compat-table/es2016plus/#test-Asynchronous_Iterators_for-await-of_loops) to run this notebook, such as Chrome 63+, Firefox 57+ or Safari Technology Preview 48.

[Asynchronous programming](https://beta.observablehq.com/@mbostock/introduction-to-promises) (or _async_, for short) allows the browser to do multiple things at the same time, such as to download files and perform complex calculations and respond fluidly to user interaction. Async iteration is a simple extension of this concept: rather than a single async value, you have _multiple_ async values and you want to step through them one at a time.

For instance, say you have several files you want to load into your notebook:
        `;
      }
    },
    {
      name: "urls",
      value: function() {
        return [
          "https://gist.githubusercontent.com/mbostock/2560c4da123c9d7bb5b2cb8da9f1f62f/raw/119a77019ee7b8b58f241a274081ad0cb1b105fb/2014-acs5-B01003-state-01.json",
          "https://gist.githubusercontent.com/mbostock/2560c4da123c9d7bb5b2cb8da9f1f62f/raw/119a77019ee7b8b58f241a274081ad0cb1b105fb/2014-acs5-B01003-state-04.json",
          "https://gist.githubusercontent.com/mbostock/2560c4da123c9d7bb5b2cb8da9f1f62f/raw/119a77019ee7b8b58f241a274081ad0cb1b105fb/2014-acs5-B01003-state-45.json"
        ];
      }
    },
    {
      inputs: ["md"],
      value: function(md) {
        return md`
These files contain population estimates by county for Alabama, Arizona and South Carolina; the exact meaning isn’t important for this notebook. You can load these files in parallel using [_array_.map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) and [Fetch](https://fetch.spec.whatwg.org/) (or here, a convenience wrapper for fetching and parsing JSON from [d3-fetch](http://github.com/d3/d3-fetch)):
        `;
      }
    },
    {
      name: "promises",
      inputs: ["urls", "d3"],
      value: function(urls, d3) {
        return urls.map(url => d3.json(url));
      }
    },
    {
      name: "datasets",
      inputs: ["promises"],
      value: function(promises) {
        return Promise.all(promises);
      }
    },
    {
      inputs: ["md"],
      value: function(md) {
        return md`
You can wait for these fetches to finish using [Promise.all](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise/all). Either define the all-promise in a separate cell for implicit await, as above, or use an explicit \`await\`, as below. Once the files are loaded, you can use normal, _synchronous_ iteration—a for loop—to iterate over them and do something, like compute a sum.
        `;
      }
    },
    {
      inputs: ["urls", "d3"],
      value: async function(urls, d3) {
        let total = 0;
        const datasets = await Promise.all(urls.map(url => d3.json(url)));
        for (const dataset of datasets) {
          for (let i = 1; i < dataset.length; ++i) {
            total += +dataset[i][0];
          }
        }
        return total;
      }
    },
    {
      inputs: ["md"],
      value: function(md) {
        return md`
But what if you don’t want to wait until _all_ the data is loaded? What if you want to [show intermediate results](https://beta.observablehq.com/@mbostock/showing-progress) as the files load? Observable uses [generators](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Iterators_and_Generators) to allow cells to yield a value that changes over time. Wait for each file to load, then yield the incremental sum:
        `;
      }
    },
    {
      inputs: ["urls", "d3"],
      value: async function*(urls, d3) {
        let total = 0;
        for (const url of urls) {
          const dataset = await d3.json(url);
          for (let i = 1; i < dataset.length; ++i) {
            total += +dataset[i][0];
            yield total;
          }
        }
        return total;
      }
    },
    {
      inputs: ["md"],
      value: function(md) {
        return md`
By using \`await\` and \`yield\` in the same cell, you’ve written an asynchronous generator. Congrats! 🎉 But wait, there’s more!

The cell above loads the files serially; it waits for the sum to be computed for the previous file before starting to fetch for the next file. If desired, you can instead start all the fetches simultaneously, and then step through the files one-by-one to compute the sum. As long as the server can handle the load, it’s typically faster to download multiple files concurrently. And unlike Promise.all, we don’t have to wait for all the files to download—just the next file in the list.
        `;
      }
    },
    {
      inputs: ["urls", "d3"],
      value: async function*(urls, d3) {
        let total = 0;
        for (const promise of urls.map(url => d3.json(url))) {
          const dataset = await promise;
          for (let i = 1; i < dataset.length; ++i) {
            total += +dataset[i][0];
            yield total;
          }
        }
        return total;
      }
    },
    {
      inputs: ["md"],
      value: function(md) {
        return md`
This pattern—iterating over an array of promises, and waiting for each one to resolve sequentially—can be expressed more succinctly using the new for-await-of loop:
        `;
      }
    },
    {
      inputs: ["urls", "d3"],
      value: async function*(urls, d3) {
        let total = 0;
        for await (const dataset of urls.map(url => d3.json(url))) {
          for (let i = 1; i < dataset.length; ++i) {
            total += +dataset[i][0];
            yield total;
          }
        }
        return total;
      }
    },
    {
      inputs: ["md"],
      value: function(md) {
        return md`
So, async iteration is a way to _consume_ (iterate over) async values, while an async generator is a way to _produce_ (yield) async values. The async generators above are implicit—they are cells that both \`await\` and \`yield\`. But you can also make an explicit async generator function in Observable using vanilla JavaScript:
        `;
      }
    },
    {
      name: "foo",
      inputs: ["Promises"],
      value: function(Promises) {
        return async function* foo() {
          for (let i = 1; i <= 1000; ++i) {
            await Promises.delay(100);
            yield i;
          }
        };
      }
    },
    {
      inputs: ["md"],
      value: function(md) {
        return md`
Calling _foo_ returns an async generator that yields an incrementing number every 100 milliseconds. It starts at 1 and goes up to 1000. You can show these numbers in a notebook cell by simply returning the generator:
        `;
      }
    },
    {
      inputs: ["foo"],
      value: function(foo) {
        return foo();
      }
    },
    {
      inputs: ["md"],
      value: function(md) {
        return md`
Alternatively, you can read the yielded values “by hand” using the iterator protocol:
        `;
      }
    },
    {
      inputs: ["foo"],
      value: async function*(foo) {
        const generator = foo();
        const iterator = generator[Symbol.asyncIterator]();
        while (true) {
          const { done, value } = await iterator.next();
          if (done) return;
          yield value;
        }
      }
    },
    {
      inputs: ["md"],
      value: function(md) {
        return md`
Observable already supported async generators in a sense: you can also define a (synchronous) generator cell that yields promises. Observable waits until the previous promise resolves before pulling the next one from the generator.
        `;
      }
    },
    {
      name: "altFoo",
      inputs: ["Promises"],
      value: function(Promises) {
        return function* altFoo() {
          for (let i = 0; i < 1000; ++i) {
            yield Promises.delay(100, i);
          }
        };
      }
    },
    {
      inputs: ["altFoo"],
      value: function(altFoo) {
        return altFoo();
      }
    },
    {
      inputs: ["md"],
      value: function(md) {
        return md`
And even a synchronous generator cell in Observable is implicitly async: Observable only pulls one value per animation frame from the generator, giving you fluid sixty frames per second by default.
        `;
      }
    },
    {
      name: "fastFoo",
      value: function() {
        return function* fastFoo() {
          for (let i = 0; i < 1000; ++i) {
            yield i;
          }
        };
      }
    },
    {
      inputs: ["fastFoo"],
      value: function(fastFoo) {
        return fastFoo();
      }
    },
    {
      inputs: ["md"],
      value: function(md) {
        return md`
But async generators are a lot more flexible that normal generators: you can both \`yield\` and \`await\`! (Also, a normal generator must know synchronously whether it’s done, whereas an asynchronous generator can decide whenever it wants to return.) For example, async generators make it very easy to express animations as a sequence of transitions between keyframes: first yield the DOM element you want to display in the notebook, and then repeatedly await for each transition to finish before starting the next.
        `;
      }
    },
    {
      inputs: ["width", "d3", "DOM"],
      value: async function*(width, d3, DOM) {
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
    },
    {
      name: "d3",
      inputs: ["require"],
      value: function(require) {
        return require("d3@^5.8");
      }
    }
  ]
};

const notebook = {
  id: "417ace5e790eb84c@500",
  modules: [m0]
};

export default notebook;
