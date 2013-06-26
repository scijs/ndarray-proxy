"use strict"

var ndarray = require("ndarray")
var bits = require("bit-twiddle")

function createLazyArray(shape, func) {
  var d = shape.length
  var shape_bits = new Array(d)
  var total_bits = 0
  var className = "Lazy1DStore_" + func.name
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
  
  var code = ["'use strict'"]
  code.push(["function ", className, "(){};var proto=", className].join(""))
  code.push("proto.set=function(i,v){throw new Error('ndarray-lazy: Can\\'t write to lazy ndarray')}")
  code.push("proto.length=" + (1<<total_bits))
  code.push(["proto.get=function(i){return func(", args.join(","), ");}"].join(""))
  code.push("return " + className)
  
  var store = new Function("func", code.join("\n"))
  
  return ndarray(store(func), shape, stride, 0)
}
module.exports = createLazyArray