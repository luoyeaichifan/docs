---
name: mysql
sort: 0
---

[教程](https://www.cnblogs.com/webnote/p/5753996.html)

- 安装:

```
docker pull mysql
docker run -p 3306:3306 --name mymysql -v $PWD/conf:/etc/mysql/conf.d -v $PWD/logs:/logs -v $PWD/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=**** -d mysql:5.6



```		

- 登陆

```
mysql -h 127.0.0.1 -u root -ppassword


[root@host]# mysql -u root -p
Enter password:******
```

- 导入数据库文件

```
1、将数据库文件拷贝到/root/test.sql
create database test
show databases;
use test;
source /root/test.sql
show tables

```

- 查询版本

```
select version();
```

- 当前所在数据库

```
select database();
```

- mysql 设置外网访问

```
一、设置MySQL服务允许外网访问

修改mysql的配置文件，有的是my.ini（windows），有的是my.cnf（linux），

在配置文件中增加

[mysqld]

port=3306

bind-address=0.0.0.0

然后重新启动mysql服务，执行service mysql restart。

二、设置mysql用户支持外网访问

需要使用root权限登录mysql，更新mysql.user表，设置指定用户的Host字段为%，默认一般为127.0.0.1或者localhost。

1.登录数据库
mysql -u root -p

输入密码
mysql> use mysql;


2.查询host
mysql> select user,host from user;


3.创建host
如果没有"%"这个host值,就执行下面这两句:
mysql> update user set host='%' where user='root';
mysql> flush privileges;


4.授权用户
（1）任意主机以用户root和密码mypwd连接到mysql服务器
mysql> GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'mypwd' WITH GRANT OPTION;
mysql> flush privileges;

（2）IP为192.168.133.128的主机以用户myuser和密码mypwd连接到mysql服务器
mysql> GRANT ALL PRIVILEGES ON *.* TO 'myuser'@'192.168.133.128' IDENTIFIED BY 'mypwd' WITH GRANT OPTION; 
mysql> flush privileges;

```
		
- go访问代码

```
package main

import (
	"database/sql"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	logs.EnableFuncCallDepth(true)
	logs.SetLogFuncCallDepth(4)
	//打开数据库
	//DSN数据源字符串：用户名:密码@协议(地址:端口)/数据库?参数=参数值
	//只能连接存在的数据库
	db, err := sql.Open("mysql", "root:123456@tcp(47.104.66.33:3306)/test?charset=utf8")
	//db, err := sql.Open("mysql", "root:@tcp(47.104.66.33:3306)/test?charset=utf8")
	if err != nil {
		beego.Info(err)
	}

	//关闭数据库，db会被多个goroutine共享，可以不调用
	defer db.Close()


	// 创建数据库
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS test.hello(world varchar(50))")
	if err != nil{
		beego.Info(err)
	}


	rs, err := db.Exec("INSERT INTO test.hello(world) VALUES ('hello world')")
	if err != nil{
		beego.Info(err)
	}
	rowCount, err := rs.RowsAffected()
	if err != nil{
		beego.Info(err)
	}
	beego.Info("inserted rows", rowCount)


	rows, err := db.Query("SELECT world FROM test.hello")
	if err != nil{
		beego.Info(err)
	}

	for rows.Next(){
		var s string
		err = rows.Scan(&s)
		if err !=nil{
			beego.Info(err)
		}
		beego.Info("found row containing ", s)
	}
	rows.Close()


}

```

# 语法

```
mysql是关系型数据库,可以理解成表格的概念
表头(header):每一列的名称;
列(col):具有相同数据类型的数据的集合
行(row):每一行描述对象的具体信息
值(value):行的具体信息
键(key):表中用来识别某个特定的人\物的方法,唯一性
```

- [数据类型](http://www.cnblogs.com/zbseoag/archive/2013/03/19/2970004.html)

```
数字类型
	整数:tinyint,smallint,mediumint,init,bigint
	浮点数:float,double,real,decimal
日期和时间:date,time,datetime,timestamp,year
字符串类型:
	字符串:char,varchar
	文本:tinytext,text,mediumtext,longtext
	二进制(图片、音乐):tinyblob,blob,mediumblob,longblob
```

- 创建数据库

```
create database 数据库名 [其他选项];

```

- 选择数据库

```
show databases;
use 数据库名
```

- 创建数据库表

```
create table 表名称(列声明);

以创建 students 表为例, 表中将存放 学号(id)、姓名(name)、性别(sex)、年龄(age)、联系电话(tel) 这些内容:

	create table students
	（
		id int unsigned not null auto_increment primary key,
		name char(8) not null,
		sex char(4) not null,
		age tinyint unsigned not null,
		tel char(13) null default "-"
	);
	
较长语句容易输入错误,可以将语句保存为createtable.sql的文件中,通过命令输入:
mysql -D 数据库名称 -u root -p < createtable.sql

语句解说:
int 该列的数据类型
unsigned 无符号类型
not null 不能为空
auto_increment 若插入数据时该列为NULL,mysql自动产生一个比现存值更大的唯一值,注意:每张表仅能有一个这样的值且所在列必须为索引列
primary key 表的主键
default 指定该列值为空时的默认值


```

- 向表中插入数据

```
insert [into] 表名 [(列名1,列名2,列名3,...)] values (值1,值2,值3,...);
insert into students (name,sex,age) values("xiaoming","nv",21);
insert into students values(NULL, "xiaohong", "nan", 20, "13811371377");
insert into students values(NULL, "xiaogang", "nan", 20, "13811371377");
```


- 查询表中的数据

```
select 列名称 from 表名称 [查询条件];
select name, age from students;
select * from students where sex="nv";

where 支持:例如 =、>、<、>=、<、!= 以及一些扩展运算符 is [not] null、in、like、or、and 等等

 select * from students where age > 21;
 select * from students where name like "%王%";
 select * from students where id<5 and age>20;

```

- 更新表中的数据

```
	update 表名称 set 列名称=新值 where 更新条件;
```

- 删除表数据

```
delete from 表名称 where 删除条件
```

## 创建后表的修改

- 添加列

```
alter table 表名 add 列名 列数据类型 [after 插入位置];
```

- 修改列

```
alter table 表名 change 列名称 列新名称 数据类型;
```

- 删除列

```
alter table 表名 drop 列名称;
```

- 重命名表

```
alter table 表名 rename 新表名;

```

- 删除表

```
drop table 表名;
```

- 删除整个数据库

```
drop database 数据库名
```

## mysql 面试题


[链接](https://www.cnblogs.com/dannylinux/articles/8288790.html)


- mysql 开启与关闭

```
service mysqld start
service mysqld stop
```

- 	修改密码

```
 mysqladmin -u root -p12345 password '123456'
```

- 查看当前数据库的字符集

```
show variables like "%charac%";
```

- 查看当前登陆的用户

```
select user();
```

- 创建gbk字符集的数据库,并且查询数据库

```
create database oldboy default character set gbk;
show create database oldboy;
```

- 创建用户oldboy,使之可以管理oldboy数据库

```
grant select,update,alter,delete,drop,insert on oldboy.* to oldboy@localhost identified by '123456';
show grants for oldboy@localhost;
```

- 查看当前数据有哪些用户

```
select user,host from mysql.user;
```

- 创建一个innodb GBK表test，字段id int(4)和name varchar(16)

```
create table test (id int(4),name varchar(16)) engine=InnoDB default charset=gbk;
```

- 查看建表结构及表结构的SQL语句

```
desc test;
show create table test;
```

- 再批量插入2行数据 “2,老男孩”，“3,oldboyedu” 

```
insert into test (id,name) values (2,"laonanhai") ,(3,"oldboyyedu");
```

- 把数据id等于1的名字oldboy更改为oldgirl

```
mysql> update test set name='oldgirl' where id=1;
```

- 在字段name前插入age字段，类型tinyint(2)

```
mysql> alter table test add age tinyint(2) after id;
```

- 不退出数据库完成数据库的备份

```
system mysqldump -uroot -p123456 -B -x -F --events oldboy > /opt/bak.sql;
```

- 删除数据库中的所有数据,并查看

```
delete from test;
```

- 删除表和数据库

```
drop table test;
drop database oldboy;
```

- 恢复数据库

```
system mysql -uroot -p123456 </opt/test.sql
```

- 把库表的gbk字符集改成UTF8

```
alter database oldboy default charset utf8
alter table test default charset utf8
```

- 把id设置为主键,在name字段上面创建普通索引

```
alter table test add primary key(id);
alter table test add index index_name(name);
```

```
26.   在字段name后插入手机号字段(shouji)，类型char(11)。

mysql> alter table test add shouji char(11) after name;

 

27.   所有字段上插入2条记录（自行设定数据）

mysql> insert into test (id,age,name,shouji) values ('4','27','wangning','13833573773');

mysql> insert into test (id,age,name,shouji) values ('5','30','litao','13833573773');
```
- 对手机字段前8个字符创建普通索引

```
alter table test add index index_shouji(shouji(8))
```

- 添加主键索引

```
alter table test add primary key id_name(id)
```

- 查看创建的索引以及索引类型等信息

```
show index from test;
show index from test\G;
```

- 删除name shouji的索引

```
alter table test drop index index_name
alter table test drop index index_shouji
```

- 对于name的前六个字符和shouji的前8个字符创建联合索引

```
create index index_name_shouji on test(name(6),shouji(8));
```

- 查询手机号以135开头的，名字为oldboy的记录（提前插入）

```
select * from test where name="oldbody" and shouji like "135%"; 
select * from test where name="wangning" and shouji like "138%";
```

- 查询上述语句的执行计划(是否使用联合索引)

```
explain select * from test where name="wangning" and shouji like "138%"\G;
```

- 将表的引擎改成myisam

```
alter table test engine=myisam
```

- 回收revoke用户的select权限

```
revoke select on oldboy.* from oldboy@localhost
```

- 删除用户

```
drop user oldboy@localhost;
```

- 关闭数据库

```
mysqladmin -uroot -p123456 shutdown;
```

## 面试问题

- 请解释关系型数据库的概念优缺点

```
关系型数据库就是由二维表及其之间的联系所组成的数据组织

特点: 事务的一致性
	  容易理解、方便、支持SQL
	  
缺点: 
	1、高并发的读写需求:网站用户的并发非常高 往往每秒上万次读写请求,硬盘的I/O是个很大的瓶颈
	2、对于数据量巨大的网站来说,关系型数据库的查询效率非常低
	3、固定的表结构
```

- 关系型数据库的典型产品、特点及应用场景

```
1、SQLserver
承载中小型web后台数据
2、mysql 开源
承载中小型web后台数据
3、oracle
国旗事业单位
```

- 请解释非关系型数据库概念及主要特点

```
1、使用键值对存储数据,且结构不稳定
2、一般不支持ACID特性(数据库事务正确执行的基本要素,
原子性atomicity
一致性consistency
隔离性lsolation
持久性durability)
3、基于键值对,数据没有耦合性,容易扩展
4、不提供SQL支持,学习和使用成本高
```

- 请说出非关系型数据库的典型产品、特点以及应用场景

```
MongoDB

redis

sqllite
```

- 详细描述sql语句分类以及对应代表性关键字

```
DDL (data definition language) (create alter drop),管理基础数据库,例库、表
DCL (data control language) (grant、revoke、commit、rollback),用户授权,权限回收,数据提交回滚
DML (data manipulation language) 数据操作语言select insert delete update
```

- char(4)与varchar(4)的差别

```
char(4)是固定长度4,不够四位时,空格补全
varchar(4)是变长长度,不到4位,不补全
```

```
46.   如何授权oldboy用户从172.16.1.0/24访问数据库。
mysql> grant all on *.* to oldboy@'172.16.1.%' identified by '123456';
```

- 什么是mysql多实例

```
在一台服务器上,mysql服务开启多个不同的端口,运行多个服务进程
```

- 如何加强mysql安全

```
1、避免从互联网访问mysql.确保特定主机才拥有访问权限
2、定期备份数据库
3、禁用或限制远程访问
4、移除test数据库(默认匿名用户可以访问test数据库)
5、禁用local infile
6、移除匿名用户和废弃的用户
7、限制mysql数据库用户的权限
8、移除和禁用.mysql_history文件
```

- delete 和 truncate删除数据的区别

```
truncate table test 执行更快,清空物理文件,清空表中的所有内容
delete from test 是逻辑删除,按行删除,而且可以通过where语句选择要删除的行
```

- mysql 主从复制的原理

```
1、主:binlog线程记录所有改变了数据库数据的语句,放进master上的binlog中
2、从:IO线程,在使用start slave之后,负责从master上拉去binlog内容,放进自己的relay log中
3、从:SQL执行线程,执行relay log中的语句

配置步骤:
1、主库开启binlog日志功能
2、全备数据库,记录好binlog文件和相应的位置
3、从库上配置和主库的连接信息
4、将全备数据库导入从库
5、从库启动slave
6、在从库上查看同步状态,确认是否同步成功
```


