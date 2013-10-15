"use strict"

var ndarray = require("ndarray")
var bits = require("bit-twiddle")

function defaultGetter() {
  throw new Error("ndarray-lazy: Getter not implemented")
}

function defaultSetter() {
  throw new Error("ndarray-lazy: Setter not implemented")
}

function createLazyArray(shape, get_func, set_func) {
  var d = shape.length
  if(d === 0) {
    return ndarray([], [])
  }
  var shape_bits = new Array(d)
  var total_bits = 0
  var className = "Proxy1DStore"
  for(var i=0; i<d; ++i) {
    shape_bits[i] = bits.log2(bits.nextPow2(shape[i]))
    total_bits += shape_bits[i]
  }
  
  if(total_bits > 32) {
    throw new Error("ndarray-lazy: Not enough addressable bits.  Can't create lazy array: " + shape)
  }
  
  var stride = new Array(d)
  var args = new Array(d)
  var sz = 0
  for(var i=d-1; i>=0; --i) {
    stride[i] = 1<<sz
    if(sz === 0) {
      args[i] = "i&"+((1<<shape_bits[i])-1)
    } else {
      args[i] = ["(i>>>", sz, ")&", ((1<<shape_bits[i])-1)].join("")
    }
    sz += shape_bits[i]
  }
  
  var code = []
  code.push(["function ", className, "(){};var proto=", className].join(""))
  code.push("proto.length=" + (1<<total_bits))
  code.push(["proto.get=function(i){return get_func(", args.join(","), ")}"].join(""))
  code.push("proto.set=function(i,v){return set_func(", args.join(","), ",v)}")
  code.push("return " + className)
  
  var store = new Function("get_func", "set_func", code.join("\n"))
  return ndarray(store(get_func||defaultGetter, set_func||defaultSetter), shape, stride, 0)
}
module.exports = createLazyArray
