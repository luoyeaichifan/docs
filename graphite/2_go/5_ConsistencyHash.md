---
name: hash 一致性
sort: 4
---

[https://github.com/jjneely/statsrelay](https://github.com/jjneely/statsrelay)
## 示例


```
var hashRingGather = NewJumpHashRing(1)  //生成hash句柄
hashRingGather.AddNode(Node{statsdAdress, ""}) //向该句柄添加节点
node, err = hashRingGather.GetNode(key)   //key
	
```