---
name: vue
sort: 3
---

# vue的使用介绍

- vue的安装

```
npm install vue
npm install vue --registry=https://registry.npm.taobao.org
加上--global参数会自动全局安装

cli命令行工具
npm install --global vue-cli

测试
vue -V

```



- vue的调试神器:vue-devtools

```
谷歌商店里面有
```
		
- Babel 广泛使用的转码器		

```
npm install -g babel-cli
babel -V
```

- Webpack 前端打包工具

```
```

- 快速构建一个vue.js程序

```
//初始化一个以webpack为模版,项目名称为movie_view的项目
vue init webpack movie_view
cd movie_view
npm install
npm run dev

```

- 目录介绍

```
.
├── README.md
├── build
├── config
├── index.html
├── node_modules
├── package-lock.json
├── package.json
├── src
├── static
└── test

build:针对打包命令npm run build 或者其他命令中的打包配置和工具
config:项目的基本配置
node_modules:npm install 自动生成的node使用插件的所在地
src: 开发者编写代码

src
├── App.vue
├── assets
├── components
├── main.js
└── router

assets:用于放静态页面的图片或其他静态资源
components: 编写的组件代码
router: 路由
App.vue: 入口页面的文件


```


# 数据库的搭建


- NoSQL 非关系型数据库

```
键值存储数据库
列存储数据库
文档型数据库
图形数据库

MongoDB 的可视界面Studio 3T
```

- 数据库的分析与设计


#使用express 进行web开发

	新建文件夹
	npm init
	
	npm install express --save

	编写helloworld

	vi index.js

```
var express = require('express');

var app = express();

//定义路由
app.get('/', function (req, res) {
    res.send('Hello World!');
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('listen http://%s:%s', host, port);
});
```

	node index.js
	
- 	express提供了一个方便的工具--应用生成器Express

```
npm install express-generator -g
express book_service
cd book_service
npm install
npm start
```
	
目录介绍
	
```
[~/work/vue/book_service/book_service]$tree -L 1
.
├── app.js
├── bin
├── common
├── models
├── node_modules
├── package-lock.json
├── package.json
├── public
├── routes
└── views

bin 文件夹中的www.js包含着对启动项目的一些测试服务器配置:启动服务器的端口监听、bug控制台输出
public 静态资源
routes 项目的全部代码和路由内容
views .jade是routes文件夹下的逻辑代码调用的相关模板文件

```

# 连接数据库

```
Mongoose作为连接MongoDB的中间件
npm install mongoose --save

var express = require('express');
var router = express.Router();

//引入数据库
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//定义路由
router.get('/mongooseTest', function(req, res, next) {
    mongoose.connect('mongodb://47.104.66.33/pets', { useMongoClient: true });
    mongoose.Promise = global.Promise;
    var Cat = mongoose.model('Cat', { name: String });
    var tom = new Cat({ name: 'Tom' });
    tom.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('success insert');
        }
    });
    
    res.send('数据库连接测试');

});

module.exports = router;
```

# 使用supervisor 监控代码的修改

```
npm install -g supervisor
//代码修改,会自动重新载入代码
supervisor bin/www
```

# 用户系统的开发

# 前台API开发


# vue-router 

vue.js的路由控制和管理

```
npm install vue-router
``` 








	

