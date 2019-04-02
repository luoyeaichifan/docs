---
name: go与mongodb
sort: 3

---



```go
package main

import (
    "fmt"
    "log"

    "gopkg.in/mgo.v2"
    "gopkg.in/mgo.v2/bson"
)

type Person struct {
    Name  string
    Phone string
}

func main() {
    session, err := mgo.Dial("localhost:27017")
    if err != nil {
        panic(err)
    }
    defer session.Close()

    // Optional. Switch the session to a monotonic behavior.
    session.SetMode(mgo.Monotonic, true)

    c := session.DB("test").C("people")
    err = c.Insert(&Person{"superWang", "13478808311"},
        &Person{"David", "15040268074"})
    if err != nil {
        log.Fatal(err)
    }

    result := Person{}
    err = c.Find(bson.M{"name": "superWang"}).One(&result)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Name:", result.Name)
    fmt.Println("Phone:", result.Phone)
}
--------------------- 
作者：一蓑烟雨1989 
来源：CSDN 
原文：https://blog.csdn.net/wangshubo1989/article/details/75105397 
版权声明：本文为博主原创文章，转载请附上博文链接！
```



