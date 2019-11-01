export class Cell<T> {
  private body: () => T;
  constructor(body: () => T) {
    this.body = body;
  }
  value(): T {
    return this.body();
  }
}

// export function cell<T>(value?: any): Cell<T> {
//   return new Cell(value);
// }

// export function cell<R>(): void;
// export function cell<R, T1>(cell1: Cell<T1>): (v1: T1) => Cell<R> {
//   return function(body: (v1: T1) => R): Cell<R> {
//     return new Cell(() => body(cell1.value()));
//   }
// }

// export function defcell<R>(f: () => () => () => R);
// export function defcell<R, T1>(f: () => (c1: Cell<T1>) => (v1: T1) =>R):void;

export class ViewofCell<T extends HTMLInputElement> extends Cell<T> {
  constructor(value: () => T) {
    super(value);
  }
}
export function viewof<T>(f: () => HTMLInputElement) {
  return new ViewofCell(f);
}
