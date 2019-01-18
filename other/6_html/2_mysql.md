---
name: mysql
sort: 1
---

- 安装:

```
docker pull mysql
docker run -p 3306:3306 --name mymysql -v $PWD/conf:/etc/mysql/conf.d -v $PWD/logs:/logs -v $PWD/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.6
```		

- 登陆

```
mysql -h 127.0.0.1 -u root -ppassword
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

		
