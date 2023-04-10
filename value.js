"use strict";
var Value = /** @class */ (function () {
    function Value(data, children, op) {
        if (children === void 0) { children = []; }
        if (op === void 0) { op = ''; }
        this._data = data;
        this._grad = 0;
        this._backward = function () { };
        this._children = new Set(children);
        this._op = op;
    }
    Object.defineProperty(Value.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Value.prototype, "grad", {
        get: function () {
            return this._grad;
        },
        enumerable: false,
        configurable: true
    });
    Value.prototype.add = function (other) {
        var _this = this;
        var out = new Value(this.data + other.data, [this, other], "+");
        out._backward = function () {
            _this._grad += out.grad;
            other._grad += out.grad;
        };
        return out;
    };
    Value.prototype.mul = function (other) {
        var _this = this;
        var out = new Value(this.data * other.data, [this, other], "*");
        out._backward = function () {
            _this._grad += other.data * out.grad;
            other._grad += _this.data * out.grad;
        };
        return out;
    };
    Value.prototype.tanh = function () {
        var _this = this;
        var t = Math.tanh(this.data);
        var out = new Value(t, [this,], "tanh");
        out._backward = function () {
            _this._grad += (1 - Math.pow(t, 2)) * out.grad;
        };
        return out;
    };
    Value.prototype.backward = function () {
        var topo = [];
        var visited = new Set();
        function build_topo(self) {
            if (!visited.has(self)) {
                visited.add(self);
                self._children.forEach(function (child) { return build_topo(child); });
                topo.push(self);
            }
        }
        build_topo(this);
        this._grad = 1;
        topo.reverse().forEach(function (self) {
            self._backward();
        });
    };
    return Value;
}());
module.exports = Value;
