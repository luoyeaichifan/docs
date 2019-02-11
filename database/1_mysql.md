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

