---
name: go与redis
sort: 2
---

[redis菜鸟教程](http://www.runoob.com/redis/redis-tutorial.html) key-value存储系统

# redis安装

```
docker pull redis:3.2
docker run -p 6379:6379 -v $PWD/data:/data  -d redis:3.2 redis-server --appendonly yes

-p 6379:6379 : 将容器的6379端口映射到主机的6379端口

-v $PWD/data:/data : 将主机中当前目录下的data挂载到容器的/data

redis-server --appendonly yes : 在容器执行redis-server启动命令，并打开redis持久化配置
```
# 查看redis是否启动

```
redis-cli 
redis-cli --raw 避免中文乱码

远程登录
redis-cli -h host -p port -a password
```

# 配置

- 获取所有配置

```
config get *
```

#  特点

- 数据类型

```
字符串
set name "runoob"
get name

散列(hash)
是一个键值对集合
hmset myhash field1 "Hello" field2 "world"
hget myhash field1
hget myhash field2


列表(list)
简单的字符串列表,按照插入顺序排序
lpush mylist test1
lpush mylist test2
lpush mylist test3
lrange mylist 0 10


集合(set) O(1)  集合内元素具有唯一性
string 类型的无序集合

sadd myset redis
sadd myset mongodb
smembers myset

有序集合(zset)
元素不允许重复,每个元素都会关联一个double类型的分数,通过该分数进行从小到大的排序


```

- 所有操作都是原子性的,支持事务(原子性、一致性、隔离性、持久性)




# redis 命令



- redis-cli 
- select 1 //redis有0-15个数据库
- flushall //清空所有数据
- set bar 1
- keys		//获取所有健
- exists bar //判断健是否存在
- del bar
- type bar   //获取健的类型
- lpush foo 1 //向列表添加元素,没有则创建
- incr bar  //递增整形字符串
- incrby bar 2 //增加2
- decr bar
- devrby bar 2
- append bar world  //追加
- strlen bar
- mset k1 v1 k2 v2 //同时设置多个键值
- mget 
- getbit bar 1 //获取1位置的2进制
- setbit bar 1 0 //将1位置的2进制改成0
- bitcount bar //获取1的个数
- bitcount bar 0 1 //获取前两个字节的1个数
- bitop or bar3 bar1 bar2 //对bar1 bar2 或运算 存储在bar3中 and or xor not
- keys *//列出所有健
- del key //删除键
 
 散列类型hash
 
- hset car price 500
- hget car price
- hmset 
- hmget
- hgetall //获取健中的所有字段和字段值
- hexists //判断字段是否存在 存在返回1
- hsetnx //同hset 0表示存在,存在不做任何操作
- hincby //增加数字
- hdel //删除一个或多个字段
- hkeys //获取字段名
- hvals //获取字段值
- hlen //获取字段的数量

 列表类型list

- lpush //向列表左边增加元素
- rpush //右边
- lpop
- rpop
- llen
- lrange list 0 -1 //返回列表中的所有元素
- lrem //删除
- lindex //获取索引处的值
- lset //根据索引赋值
- ltrim //只保留指定范围
- linsert
- rpoplpush

 集合

- sadd //增加元素
- srem //删除
- sismember //是否在集合中
- sdiff a b //属于a 不属于b的
- sinter a b //属于a 也属于b的
- sunion  a b //并
- scard //获取元素个数
- sdiffstore //并保存
- srandommember //随机

 有序集合
 
- zadd
- zscore //获取元素分数


# go语言访问redis

```
"github.com/gomodule/redigo/redis"


	pool = redis.Pool{
		MaxIdle:     10,
		MaxActive:   0,
		IdleTimeout: 120,
		Dial: func() (redis.Conn, error) {
			return redis.Dial("tcp", config.RedisAddr)
		},
	}
	conn := pool.Get()
	defer conn.Close()
	timeBegin := time.Now()
	res, err := redis.Values(conn.Do("hkeys", "GRAPHITE:PROXY_METRICS_BLACKLIST"))
	if err != nil {
		logs.Error("updateBlacklist err:", err)
	}

	tmpBlacklist := make([][]byte, 0)
	for _, v := range res {
		switch data := v.(type) {
		case []uint8:
			tmpBlacklist = append(tmpBlacklist, []byte(data))

		default:
			logs.Error("unknown type:", reflect.TypeOf(v))
		}
	}
	
		
	
```
