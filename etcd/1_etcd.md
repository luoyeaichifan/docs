---
name: etcd学习笔记
sort: 0
---

etcd 分布式的键值对数据存储系统,提供共享配置以及服务发现选主,主要用于container中,还支持快照以及查看历史

[etcd链接](https://github.com/etcd-io/etcd/tree/master/Documentation#operating-etcd-clusters)
	
### 主要功能

```
1、键值写入读取
2、过期时间
3、观察者
4、租约
5、集群管理相关操作
6、维护操作
7、用户以及权限管理
```

### 安装与配置

```
1、
wget https://github.com/coreos/etcd/releases/download/v3.3.10/etcd-v3.3.10-linux-amd64.tar.gz

tar -zxvf etcd-v3.3.10-linux-amd64.tar.gz -C /opt
vim /etc/profile
export ETCDCTL_API=3

2、配置节点 建议节点数量3、5、7、9

3、
$mv etcd-v3.3.2-linux-amd64/etcd* /$GOPATH/bin

4、启动

etcd
启动的 etcd 成员在 localhost:2379 监听客户端请求。
通过使用 etcdctl 来和已经启动的集群交互：
$ export ETCDCTL_API=3
$ ./etcdctl put foo bar
OK
$ ./etcdctl get foo
bar

5、本地多成员集群

1. 安装goreman

关于goreman可参考https://segmentfault.com/a/1190000003778084

$ go get github.com/mattn/goreman

goreman help   //检验gorenman是否安装成功

当然，记得先把GOPATH、GOROOT环境变量配置好，并记得把$GOPATH/bin添加到$PATH

 

2. 启动

Procfile下载地址 https://github.com/coreos/etcd/blob/master/Procfile

$ goreman -f Procfile start

 

注1： 必须先安装 go，请见章节 Go语言安装

注2： 这里所说的 Procfile 文件是来自 etcd 的 gitub 项目的根目录下的 Procfile 文件，但

是需要修改一下，将里面的 bin/etcd 修改为 etcd

 Profile内容如下：

# Use goreman to run `go get github.com/mattn/goreman`

etcd1: etcd --name infra1 --listen-client-urls http://127.0.0.1:2379 --advertise-client-urls http://127.0.0.1:2379 --listen-peer-urls http://127.0.0.1:12380 --initial-advertise-peer-urls http://127.0.0.1:12380 --initial-cluster-token etcd-cluster-1 --initial-cluster 'infra1=http://127.0.0.1:12380,infra2=http://127.0.0.1:22380,infra3=http://127.0.0.1:32380' --initial-cluster-state new --enable-pprof

etcd2: etcd --name infra2 --listen-client-urls http://127.0.0.1:22379 --advertise-client-urls http://127.0.0.1:22379 --listen-peer-urls http://127.0.0.1:22380 --initial-advertise-peer-urls http://127.0.0.1:22380 --initial-cluster-token etcd-cluster-1 --initial-cluster 'infra1=http://127.0.0.1:12380,infra2=http://127.0.0.1:22380,infra3=http://127.0.0.1:32380' --initial-cluster-state new --enable-pprof

etcd3: etcd --name infra3 --listen-client-urls http://127.0.0.1:32379 --advertise-client-urls http://127.0.0.1:32379 --listen-peer-urls http://127.0.0.1:32380 --initial-advertise-peer-urls http://127.0.0.1:32380 --initial-cluster-token etcd-cluster-1 --initial-cluster 'infra1=http://127.0.0.1:12380,infra2=http://127.0.0.1:22380,infra3=http://127.0.0.1:32380' --initial-cluster-state new --enable-pprof

# in future, use proxy to listen on 2379

#proxy: bin/etcd --name infra-proxy1 --proxy=on --listen-client-urls http://127.0.0.1:2378 --initial-cluster 'infra1=http://127.0.0.1:12380,infra2=http://127.0.0.1:22380,infra3=http://127.0.0.1:32380' --enable-pprof


```


