ndarray-proxy
=============
Creates lazily initialized [ndarrays](https://github.com/mikolalysenko/ndarray).  These give a logical view of a function as an ndarray.

Introduction
============
Lazy arrays work just like ndarrays, and can be used in all the same ways.  However, unlike dense arrays they do not keep any storage and instead use a function to determine the contents of the array.  Here is a simple example:

```javascript
var proxy = require("ndarray-proxy")

//Create a 10x10 lazily initialized ndarray
var x = proxy([10, 10], function(i, j) {
  console.log("Called:", i, j)
  return 10*i + j
})

x.get(1,2)    //Prints out:   Called: 1 2
x.get(7,8)    //Prints out:   Called: 7 8
```

It is possible to slice the view of a lazy ndarray, just like a regular ndarray:

```javascript
x.lo(2,3).get(1,1)            //Prints out:  Called: 3 4
x.transpose(1,0).get(3,7)     //Prints out:  Called: 7 3
```

You can use lazy ndarrays with cwise or any other library that works with ndarrays.

It is also possible to add a setter to the lazy ndarray to implement custom assignment operations.  For example:

```javascript
var y = proxy([10,10],
    function(i,j) { return 10*i+j; }, 
    function(i,j,v) {
      console.log("SET:", i, j, "=", v)
    })

y.set(2,3,10) //Prints:  SET: 2 3 = 10
```

If a setter isn't specified, then writing to the array throws an error.

# Install

You can install the library using [npm](http://npmjs.org):

```sh
npm install ndarray-lazy
```

And like all ndarray modules it should work in a browser that supports typed arrays using [browserify](https://github.com/substack/node-browserify).

# API

### `require("ndarray-proxy")(shape, get_func[, set_func])`
Creates a wrapper for an ndarray

* `shape` is the shape of the wrapped ndarray
* `get_func(i0,i1,...)` implements access to the ndarray
* `set_func(i0,i1,...,v)` implements writing to the ndarray

**Returns** A proxy view of the functions.

# Credits
(c) 2013 Mikola Lysenko. MIT License