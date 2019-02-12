---
name: hadoop环境准备
sort: 1
---

- 运行模式:单机模式、伪分布式模式、完全分布式模式

- 安装步骤


1、安装运行环境

虚拟机master、slave1、slave2  centos7

2、修改主机名用户名

```
vi /etc/sysconfig/network
HOSTNAME=master

vi /etc/hosts
192.168.228.130 master
```

3、配置静态ip地址

```
cat /etc/sysconfig/network-scripts/ifcfg-ens33 
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
#BOOTPROTO=dhcp
BOOTPROTO=static
IPADDR=192.168.228.130
NETMASK=255.255.0.0
GATEWAY=192.168.1.1
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=ens33
UUID=c6df0d9a-5855-4b95-8797-78d67a33647d
DEVICE=ens33
ONBOOT=yes
```

4、配置ssh无密码连接

```
关闭防火墙
ssh-keygen -t rsa

ssh-copy-id -i ~/.ssh/id_rsa.pub hadoop@slave1
ssh-copy-id -i ~/.ssh/id_rsa.pub hadoop@slave2
```

5、安装jdk
6、配置hadoop

```
cd /opt/hadoop-0.20.2-cdh3u6/conf/

[hadoop@master conf]$ cat hadoop-env.sh 
export HADOOP_HOME=/opt/hadoop-0.20.2-cdh3u6


[hadoop@master conf]$ cat core-site.xml 
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>

<!-- Put site-specific property overrides in this file. -->

<configuration>
	<property>
	<name>fs.default.name</name>
	<value>hdfs://master:9000</value>
	</property>

</configuration>


[hadoop@master conf]$ cat hdfs-site.xml 
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>

<!-- Put site-specific property overrides in this file. -->

<configuration>
	<property>
		<name>dfs.replication</name>
		<value>3</value>
	</property>
	<property>
		<name>dfs.name.dir</name>
		<value>/opt/hdfs/name</value>
	</property>
	<property>
		<name>dfs.data.dir</name>
		<value>/opt/hdfs/data</value>
	</property>

</configuration>


[hadoop@master conf]$ cat mapred-site.xml 
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>

<!-- Put site-specific property overrides in this file. -->

<configuration>
	<property>
		<name>mapred.job.tracker</name>
		<value>master:9001</value>
	</property>
</configuration>


[hadoop@master conf]$ cat slaves 
slave1
slave2
[hadoop@master conf]$ cat masters 
master


```

7、格式化hdfs

hadoop namenode -format
chmod +x -R /opt/hadoop-0.20.2-cdh3u6/bin/
/opt/hadoop-0.20.2-cdh3u6/bin/start-all.sh

8、启动hadoop并验证安装






- 防火墙问题:

```
https://blog.csdn.net/lsxy117/article/details/47217161
```



- 验证

主节点jps

```
[hadoop@master name]$ jps
9414 NameNode
15655 Jps
9708 JobTracker
9629 SecondaryNameNode
```

从节点jps

```
16418 Jps
14775 DataNode
14937 TaskTracker
```



```
cd /home/hadoop/
echo "data mining on data warehouse" > words
hadoop dfs -mkdir /input
hadoop dfs -put /home/hadoop/words /input
hadoop jar /opt/hadoop-0.20.2-cdh3u6/hadoop-examples-0.20.2-cdh3u6.jar wordcount /input /output
hadoop dfs -cat /output/part-r-00000


[hadoop@master name]$ hadoop dfs -cat /ouput/part-r-00000
data	2
mining	1
on	1
warehouse	1
```


### hive(hadoop的一个客户端) 安装

hive可以安装在集群的任意节点

- 安装元数据库

hive的元数据和数据是分开存放的,数据存放在HDFS上,元数据默认存在自带的derby,由于derby只支持一个用户访问hive,所以选择使用mysql

安装mysql客户端
yum install mysql

安装mysql服务端
yum install mysql-server
yum install mysql-devel

- 修改Hive配置文件





