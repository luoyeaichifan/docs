---

name: thrift
sort: 19
---





- 安装地址

  <http://archive.apache.org/dist/thrift/0.9.2/>

- 设置环境变量

  C:\work\tools\thrift

- 验证

  cmd

  thtift -version



- thrift -r --gen go .\example.thrift

  ```go
  namespace go demo.rpc
  namespace java demo.rpc
   
  // 测试服务
  service RpcService {
   
  	// 发起远程调用
  	list<string> funCall(1:i64 callTime, 2:string funCode, 3:map<string, string> paramMap),
   
  }
  ```

- 注意事项

  ```
  git.apache.org/thrift.git/lib/go/thrift"要与thrift工具版本保持一致
  
  
  86185@DESKTOP-HD8TDSL MINGW64 /c/work/go/src/git.apache.org/thrift.git (master)
  $ git tag
  0.10.0
  0.11.0
  0.2.0
  0.3.0
  0.4.0
  0.5.0
  0.6.0
  0.6.1
  0.7.0
  0.8.0
  0.9.0
  0.9.1
  0.9.2
  0.9.3
  0.9.3.1
  thrift-0.2.0
  thrift-0.3.0
  thrift-0.4.0
  thrift-0.5.0
  thrift-0.6.0
  thrift-0.6.1
  thrift-0.7.0
  thrift-0.8.0
  thrift-0.9.0
  v0.12.0
  
  
  ```



- server端代码

  ```go
  package main
  
  import (
  
  	"fmt"
  	"git.apache.org/thrift.git/lib/go/thrift"
  	"os"
  	"test2/server/demo/rpc"
  )
  
  const (
  	NetworkAddr = "127.0.0.1:19090"
  )
  
  type RpcServiceImpl struct {
  }
  
  func (this *RpcServiceImpl) FunCall(callTime int64, funCode string, paramMap map[string]string) (r []string, err error) {
  	fmt.Println("-->FunCall:", callTime, funCode, paramMap)
  
  	for k, v := range paramMap {
  		r = append(r, k+v)
  	}
  	return
  }
  
  func main() {
  	transportFactory := thrift.NewTFramedTransportFactory(thrift.NewTTransportFactory())
  	protocolFactory := thrift.NewTBinaryProtocolFactoryDefault()
  	//protocolFactory := thrift.NewTCompactProtocolFactory()
  
  	serverTransport, err := thrift.NewTServerSocket(NetworkAddr)
  	if err != nil {
  		fmt.Println("Error!", err)
  		os.Exit(1)
  	}
  
  	handler := &RpcServiceImpl{}
  	processor := rpc.NewRpcServiceProcessor(handler)
  
  	server := thrift.NewTSimpleServer4(processor, serverTransport, transportFactory, protocolFactory)
  	fmt.Println("thrift server in", NetworkAddr)
  	server.Serve()
  }
  
  
  ```

- client 端代码

  ```go
  package main
  
  import (
  
  	"fmt"
  	"git.apache.org/thrift.git/lib/go/thrift"
  	"net"
  	"os"
  	"test2/client/demo/rpc"
  	"time"
  )
  
  func main() {
  	startTime := currentTimeMillis()
  	transportFactory := thrift.NewTFramedTransportFactory(thrift.NewTTransportFactory())
  	protocolFactory := thrift.NewTBinaryProtocolFactoryDefault()
  
  	transport, err := thrift.NewTSocket(net.JoinHostPort("127.0.0.1", "19090"))
  	if err != nil {
  		fmt.Fprintln(os.Stderr, "error resolving address:", err)
  		os.Exit(1)
  	}
  
  	useTransport := transportFactory.GetTransport(transport)
  	client := rpc.NewRpcServiceClientFactory(useTransport, protocolFactory)
  	if err := transport.Open(); err != nil {
  		fmt.Fprintln(os.Stderr, "Error opening socket to 127.0.0.1:19090", " ", err)
  		os.Exit(1)
  	}
  	defer transport.Close()
  
  	for i := 0; i < 1000; i++ {
  		paramMap := make(map[string]string)
  		paramMap["name"] = "qinerg"
  		paramMap["passwd"] = "123456"
  		r1, e1 := client.FunCall(currentTimeMillis(), "login", paramMap)
  		fmt.Println(i, "Call->", r1, e1)
  	}
  
  	endTime := currentTimeMillis()
  	fmt.Println("Program exit. time->", endTime, startTime, (endTime - startTime))
  }
  
  // 转换成毫秒
  func currentTimeMillis() int64 {
  	return time.Now().UnixNano() / 1000000
  }
  
  
  ```


- 架构

  server 服务器进程调度

  processor rpc 接口处理函数分发，IDL定义接口的实现将挂接到这里面

  protocol 协议（二进制或者xml等）

  transport 网络传输（tcp/ip，共享内存，文件共享）

- 支持的传输格式：

  | 参数                | 描述                                                 |
  | :------------------ | :--------------------------------------------------- |
  | TBinaryProtocol     | 二进制格式                                           |
  | TCompactProtocol    | 压缩格式                                             |
  | TJSONProtocol       | JSON格式                                             |
  | TSimpleJSONProtocol | 提供JSON只写协议, 生成的文件很容易通过脚本语言解析。 |
  | TDebugProtocol      | 使用易懂的可读的文本格式，以便于debug                |

- 支持的数据传输方式：

  | 参数             | 描述                                                         |
  | :--------------- | :----------------------------------------------------------- |
  | TSocket          | 阻塞式socker                                                 |
  | TFramedTransport | 以frame为单位进行传输，非阻塞式服务中使用。                  |
  | TFileTransport   | 以文件形式进行传输。                                         |
  | TMemoryTransport | 将内存用于I/O. java实现时内部实际使用了简单的ByteArrayOutputStream。 |
  | TZlibTransport   | 使用zlib进行压缩， 与其他传输方式联合使用。当前无java实现。  |

- 支持的服务模型：

  | 参数               | 描述                                                         |
  | :----------------- | :----------------------------------------------------------- |
  | TSimpleServer      | 简单的单线程服务模型，常用于测试                             |
  | TThreadPoolServer  | 多线程服务模型，使用标准的阻塞式IO。                         |
  | TNonblockingServer | 多线程服务模型，使用非阻塞式IO（需使用TFramedTransport数据传输方式） |