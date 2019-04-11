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



- 创建数据库

  use test

- 查看数据库

  show dbs

- 插入数据

  db.test.insert({"name":"hello"})

- 查看数据表

  show tables

  show collections

- 删除数据表

  db.test.drop()

- 删除数据库

  db.dropDatabase()

- 创建集合

  db.createCollection(name, options)

  ```
  capped 如果为true，则创建固定大小集合（达到最大值，自动覆盖最早的文档），且需要指定size参数
  autoIndexId 自动在_id字段创建索引
  size 为固定集合指定一个最大值（字节单位）
  max 指定固定集合中包含文档的最大数量
  ```

- 查看collection

  show collections

- 删除集合

  db.test.drop()

  ```
  > show collections
  mycol
  test
  test2
  > db.test.drop()
  true
  > show collections
  mycol
  test2
  ```

- 文档增删改查

  ```
  增加
  db.test.insert({uid:1,name:"xiaohong",age:"18"})
  db.test.insert({uid:1,name:"xiaoming",age:"19"})
  查询
  db.test.find()
  db.test.find().pretty()
  // lt lte gt gte 
  {<key>:{$lt:<value>}}
  and
  db.col.find({k1:v1,k2:v2})
  db.col.find({$or:[{k1:v1},{k2:v2}]})
  
  更新
  db.col.update({'title':'MongoDB 教程'},{$set:{'title':'MongoDB'}},{multi:true})
  db.collection.update(
     <query>,
     <update>,
     {
       upsert: <boolean>,
       multi: <boolean>,
       writeConcern: <document>
     }
  )
  参数说明：
  
  query : update的查询条件，类似sql update查询内where后面的。
  update : update的对象和一些更新的操作符（如$,$inc...）等，也可以理解为sql update查询内set后面的
  upsert : 可选，这个参数的意思是，如果不存在update的记录，是否插入objNew,true为插入，默认是false，不插入。
  multi : 可选，mongodb 默认是false,只更新找到的第一条记录，如果这个参数为true,就把按条件查出来多条记录全部更新。
  writeConcern :可选，抛出异常的级别。
  
  删除
  db.collection.remove(
     <query>,
     {
       justOne: <boolean>,
       writeConcern: <document>
     }
  )
  
  query :（可选）删除的文档的条件。
  justOne : （可选）如果设为 true 或 1，则只删除一个文档，如果不设置该参数，或使用默认值 false，则删除所有匹配条件的文档。
  writeConcern :（可选）抛出异常的级别。
  
  ```

  

- $type 操作符

- limit

  ```
  db.COLLECTION_NAME.find().limit(NUMBER)
  从mongodb读取NUMBER条 
  ```

- 跳过多少条数据skip

  ```
  db.COLLECTION_NAME.find().limit(NUMBER).skip(NUMBER)
  ```

- 排序

  ```
  db.COLLECTION_NAME.find().sort({KEY:1})   1升序 -1降序
  ```

- 创建索引

  ```
  db.collection.createIndex(keys, options)  1升序 -1降序
  db.values.createIndex({open: 1, close: 1}, {background: true})
  ```