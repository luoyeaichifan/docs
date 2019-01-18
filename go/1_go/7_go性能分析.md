---
name: go性能分析
sort: 6
---

## cpu分析器

收集分析结果：

$ go tool pprof --text mybin http://myserver:6060:/debug/pprof/profile

## 内存分析器

http://myserver:6060:/debug/pprof/heap
优化工作经常和特定应用程序相关，但也有一些普遍建议。

- 将小对象组合成大对象。比如, 将 *bytes.Buffer 结构体成员替换为bytes。缓冲区 (你可以预分配然后通过调用bytes.Buffer.Grow为写做准备) 。这将减少很多内存分配(更快)并且减缓垃圾回收器的压力(更快的垃圾回收) 。
- 离开声明作用域的局部变量促进堆分配。编译器不能保证这些变量拥有相同的生命周期，因此为他们分别分配空间。所以你也可以对局部变量使用上述的建议

```
for k, v := range m {
   k, v := k, v   // copy for capturing by the goroutine
   go func() {
       // use k and v
   }()
}
替换为:

for k, v := range m {
   x := struct{ k, v string }{k, v}   // copy for capturing by the goroutine
   go func() {
       // use x.k and x.v
   }()
}
```

- 尽可能使用小数据类型。比如用int8代替int
-  sync.Pool 
- 不包含任何指针的对象(注意 strings,slices,maps 和 chans 包含隐含指针)不会被垃圾回收器扫描到

## 阻塞分析器

阻塞分析器展示了goroutine在等待同步原语(包括计时器通道)被阻塞的位置

http://myserver:6060:/debug/pprof/block

通过调用 runtime.SetBlockProfileRate 来激活阻塞分析器。SetBlockProfileRate 控制着由阻塞分析器报告的goroutine阻塞事件的比率。分析器力求采样出每指定微秒数内，一个阻塞事件的阻塞平均数。要使分析器记录每个阻塞事件，将比率设为1。






