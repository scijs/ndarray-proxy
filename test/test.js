var lazy = require("../ndlazy")

require("tape")("ndarray-lazy", function(t) {
  //Create a 10x10 lazily initialized ndarray
  var last_accessed = []
  var x = lazy([10, 10], function(i, j) {
    last_accessed = [i,j]
    return 10*i + j
  })

  t.equals(x.get(1,2), 12)
  t.same(last_accessed, [1,2])
  
  t.equals(x.get(7,8), 78)
  t.same(last_accessed, [7,8])
  
  t.equals(x.lo(2,3).get(1,1), 34)
  t.same(last_accessed, [3,4])
  
  x.transpose(1,0).get(3,7)
  x.set(0,0,1)
  
  t.end()
})