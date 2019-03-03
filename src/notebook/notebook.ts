import {
  Runtime,
  Inspector,
  IModule,
  IObserver,
  ObserverFactory
} from "@observablehq/runtime";
import {parseCell} from '@observablehq/parser'

interface UpdateEvent {
  type: string;
  payload: {
    cells: string[];
  }
}

class Notebook {
  runtime: Runtime;
  module: IModule;
  observer: ObserverFactory;
  latest?: string[];

  constructor() {
    this.runtime = new Runtime();
    this.module = this.runtime.module();
    this.observer = Inspector.into("#content");

    this.latest = undefined;

    window.addEventListener("message", evt => {
      const {payload: {cells}} = evt.data as UpdateEvent;
      this.latest = cells;
    });

    window.setInterval(() => this.update(), 1000);
  }

  update() {
    const cells = this.latest;
    if (cells) {
      this.latest = undefined;
      cells.forEach(code => {
        const parsed = parseCell(code);
        console.log(parsed);
      });
    }
  }
}

const theNotebook = new Notebook();
