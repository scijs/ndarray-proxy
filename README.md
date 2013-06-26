ndarray-lazy
============
Creates lazily initialized [ndarrays](https://github.com/mikolalysenko/ndarray).  These give a logical view of a function as an ndarray.

Introduction
============
Lazy arrays work just like ndarrays, and can be used in all the same ways.  However, unlike dense arrays they do not keep any storage and instead use a function to determine the contents of the array.  Here is a simple example:

```javascript
var lazy = require("ndarray-lazy")

//Create a 10x10 lazily initialized ndarray
var x = lazy([10, 10], function(i, j) {
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

You can also use lazy ndarrays with cwise or any other library that works with ndarrays.

*HOWEVER:*  You are not allowed to assing to ndarrays:

```javascript
x.set(0,0,1)  //Error!
```

# Install

You can install the library using [npm](http://npmjs.org):

```sh
npm install ndarray-lazy
```

And like all ndarray modules it should work in a browser that supports typed arrays using [browserify](https://github.com/substack/node-browserify).

# API

### `require("ndarray-lazy")(shape, func)`
The main func

# Credits
(c) 2013 Mikola Lysenko. MIT License