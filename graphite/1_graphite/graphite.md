---
name: graphite/grafana
sort: 0
---

# <a href="http://47.104.66.33:8080" target="_blank">graphite</a> 做两件事


1、存储时间序列

2、按需渲染数据图形

[docker](https://github.com/graphite-project/docker-graphite-statsd)

```
docker run -d\
 --name graphite\
 --restart=always\
 -p 80:80\
 -p 2003-2004:2003-2004\
 -p 2023-2024:2023-2024\
 -p 8125:8125/udp\
 -p 8126:8126\
 graphiteapp/graphite-statsd
```



4、测试

```
while true; do echo -n "example:$((RANDOM % 100))|c" | nc -w 1 -u 127.0.0.1 8125; done
```

cpu

```
while true 
do 
	top -b -n 1 | grep "load average" | awk -F "average:" '{print $2}' | awk -F "," '{print "cpu:"$1"|c"}' | nc -w 1 -u 127.0.0.1 8125;
	sleep 1
done
```

mem

```
while true 
do 
	free -h | grep Mem | awk -F " " '{print $4}' |  tr -cd "[0-9]" | xargs -I {} echo "mem:{}|c"  | nc -w 1 -u 127.0.0.1 8125;
	sleep 1
done

```




# <a href="http://47.104.66.33:3000/d/aKAhfYQik/cpu-mem?panelId=2&orgId=1" target="_blank">grafana</a> 展示

```$xslt
用户名: admin
密码: admin
```

# 正向代理与反向代理

[转载](https://www.cnblogs.com/Anker/p/6056540.html)

# 日志文件管理工具logrotate

logrotate程序是一个日志文件管理工具。用于分割日志文件，删除旧的日志文件，并创建新的日志文件，起到“转储”作用。可以节省磁盘空间

[logrotate](http://www.cnblogs.com/kevingrace/p/6307298.html)

# StatsD

[statsD](https://github.com/etsy/statsd#concepts)
