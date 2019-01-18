---
name: syncpool
sort: 3
---

## 示例

```
package main

import (
    "sync"
    "time"
    "fmt"
)

var bytePool = sync.Pool{
    New: func() interface{} {
        b := make([]byte, 1024)
        return &b
    },
}


func main()  {
    //defer
    //debug.SetGCPercent(debug.SetGCPercent(-1))
    a := time.Now().Unix()
    for i:=0;i<1000000000;i++{
        obj := make([]byte, 1024)
        _ = obj
    }
    b := time.Now().Unix()

    for j:=0;j<1000000000;j++  {
        obj := bytePool.Get().(*[]byte)
        _ = obj
        bytePool.Put(obj)
    }

    c := time.Now().Unix()
    fmt.Println("without pool ", b - a, "s")
    fmt.Println("with    pool ", c - b, "s")
}
```

Golang的对象池严格意义上来说是一个临时的对象池，适用于储存一些会在goroutine间分享的临时对象。主要作用是减少GC，提高性能。在Golang中最常见的使用场景是fmt包中的输出缓冲区。

在Golang中如果要实现连接池的效果，可以用container/list来实现，开源界也有一些现成的实现，比如go-commons-pool，具体的读者可以去自行了解。

变长byte的应用

[https://github.com/funny/slab](https://github.com/funny/slab)


