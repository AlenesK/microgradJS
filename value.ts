class Value {
    private _data: number;
    private _grad: number;
    private _backward: Function;
    private _children: Set<Value>;
    private _op: string;
  
    constructor(data: number, children: Array<Value> = [], op: string = '') {
        this._data = data;
        this._grad = 0;
        this._backward = () => { };
        this._children = new Set(children);
        this._op = op;
    }
  
    get data(): number {
        return this._data;
    }

    get grad(): number {
        return this._grad;
    }
    
    add(other: Value): Value {
        const out = new Value(this.data + other.data, [this, other], "+");
        out._backward = () => {
            this._grad += out.grad;
            other._grad += out.grad;
        };
        return out;
    }
  
    mul(other: Value): Value {
        const out = new Value(this.data * other.data, [this, other], "*");
        out._backward = () => {
            this._grad += other.data * out.grad;
            other._grad += this.data * out.grad;
        };
        return out;
    }

    tanh(): Value {
        const t = Math.tanh(this.data);
        const out = new Value(t, [this, ], "tanh");
        out._backward = () => {
            this._grad += (1 - t**2) * out.grad;
        };
        return out;
    }
    
    backward() {
        const topo = [];
        const visited = new Set();

        function build_topo(self) {
            if (!visited.has(self)) {
                visited.add(self);
                self._children.forEach((child) => build_topo(child));
                topo.push(self);
            }
        }
        
        build_topo(this);

        this._grad = 1;
        topo.reverse().forEach((self) => {
            self._backward();
        });
    }

}

export = Value;