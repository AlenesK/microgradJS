# microgradJS

A TypeScript implementation of Andrej Karpathy's Autograd engine "[micrograd](https://github.com/karpathy/micrograd)".

# Example usage

```js
const Value = require('./value.js');

let a = new Value(3);
let b = new Value(-2);
let c = a.add(b);
let d = c.mul(b);
let e = d.add(d.mul(a));

console.log(`${e.data}`); // Prints -8
e.backward();
console.log(a.grad); // Prints -10
console.log(b.grad); // Prints -4
```
