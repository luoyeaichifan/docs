---
name: go与postman
sort: 0
---

## 1、[Postman的安装使用](https://www.cnblogs.com/Skyyj/p/6856728.html)

## 2、go语言简单示例:

```
package main
 
import (
	"io"
	"net/http"
	"log"
	"fmt"
	"io/ioutil"
	"encoding/json"
)
 
//PlyMsgStruct 构造发送策略
type PlyMsgStruct struct {
	ListA []uint32 //发送Topic列表
	ListB []uint32 //接收Topic列表
	Type  uint32
	ID    uint32
}
 
func HelloServer(w http.ResponseWriter, r *http.Request) {
	var Ply PlyMsgStruct
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &Ply)
	io.WriteString(w, fmt.Sprintln(Ply))
}
func main() {
	for true {//此处for循环是为了main不退出
		http.HandleFunc("/hello", HelloServer)
		err := http.ListenAndServe(":12345", nil)
		if err != nil {
			log.Fatal("ListenAndServe: ", err)
		}
	}
 
}
```

## 3、验证的json

```
{
    "ListA":[
        1],
    "ListB":[
        2],
    "Type":3,
    "ID":4
    
}
```
## 4、验证结果

```
{[1] [2] 3 4}
```