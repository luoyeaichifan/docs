---
name: grpc
sort: 0
---

google 主导开发的rpc框架,使用http/2协议并用protobuf作为序列化工具


[使用链接](https://blog.csdn.net/omnispace/article/details/79562630)
- 安装protobuf

```
brew install autoconf automake libtool
./configure --prefix=your_pb_install_path

make 
make install
set your_pb_install_path to your $PATH
```

检查是否安装成功

```
protoc --version
libprotoc 3.0.0
```

然后安装golang protobuf直接使用golang的get即可

```
go get -u github.com/golang/protobuf/proto // golang protobuf 库
go get -u github.com/golang/protobuf/protoc-gen-go //protoc --go_out 工具
```

- 安装grpc-go

```
go get google.golang.org/grpc
```

- 示例程序

### pb描述

```
syntax = "proto3";
 
option objc_class_prefix = "HLW";
 
package helloworld;
 
// The greeting service definition.
service Greeter {
  // Sends a greeting
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}
 
// The request message containing the user's name.
message HelloRequest {
  string name = 1;
}
 
// The response message containing the greetings
message HelloReply {
  string message = 1;
}
```

这里定义了一个服务Greeter，其中有个API SayHello。其接受参数为HelloRequest类型，返回HelloReply类型。这里HelloRequest和HelloReply就是普通的PB定义


service定义了一个server。其中的接口可以是四种类型

rpc GetFeature(Point) returns (Feature) {}
类似普通的函数调用，客户端发送请求Point到服务器，服务器返回相应Feature.
rpc ListFeatures(Rectangle) returns (stream Feature) {}
客户端发起一次请求，服务器端返回一个流式数据，比如一个数组中的逐个元素
rpc RecordRoute(stream Point) returns (RouteSummary) {}
客户端发起的请求是一个流式的数据，比如数组中的逐个元素，服务器返回一个相应
rpc RouteChat(stream RouteNote) returns (stream RouteNote) {}
客户端发起的请求是一个流式数据，比如数组中的逐个元素，二服务器返回的也是一个类似的数据结构
后面三种可以参考官方的[route_guide](https://link.jianshu.com/?t=https://github.com/grpc/grpc-go/tree/master/examples/route_guide)示例。


使用protoc命令生成相关文件：

```
protoc --go_out=plugins=grpc:. helloworld.proto
ls
helloworld.pb.go    helloworld.proto
```

### 服务器端程序


```
package main
 
import (
    "log"
    "net"
 
    pb "your_path_to_gen_pb_dir/helloworld"
    "golang.org/x/net/context"
    "google.golang.org/grpc"
)
 
const (
    port = ":50051"
)
 
// server is used to implement helloworld.GreeterServer.
type server struct{}
 
// SayHello implements helloworld.GreeterServer
func (s *server) SayHello(ctx context.Context, in *pb.HelloRequest) (*pb.HelloReply, error) {
    return &pb.HelloReply{Message: "Hello " + in.Name}, nil
}
 
func main() {
    lis, err := net.Listen("tcp", port)
    if err != nil {
        log.Fatalf("failed to listen: %v", err)
    }
    s := grpc.NewServer()
    pb.RegisterGreeterServer(s, &server{})
    s.Serve(lis)
}

```

然后调用grpc.NewServer() 创建一个server s。接着注册这个server s到结构server上面 pb.RegisterGreeterServer(s, &server{}) 最后将创建的net.Listener传给s.Serve()。就可以开始监听并服务了，类似HTTP的ListenAndServe。


### 客户端程序

```
package main
 
import (
    "log"
    "os"
 
    pb "your_path_to_gen_pb_dir/helloworld"
    "golang.org/x/net/context"
    "google.golang.org/grpc"
)
 
const (
    address     = "localhost:50051"
    defaultName = "world"
)
 
func main() {
    // Set up a connection to the server.
    conn, err := grpc.Dial(address, grpc.WithInsecure())
    if err != nil {
        log.Fatalf("did not connect: %v", err)
    }
    defer conn.Close()
    c := pb.NewGreeterClient(conn)
 
    // Contact the server and print out its response.
    name := defaultName
    if len(os.Args) > 1 {
        name = os.Args[1]
    }
    r, err := c.SayHello(context.Background(), &pb.HelloRequest{Name: name})
    if err != nil {
        log.Fatalf("could not greet: %v", err)
    }
    log.Printf("Greeting: %s", r.Message)
}


```

