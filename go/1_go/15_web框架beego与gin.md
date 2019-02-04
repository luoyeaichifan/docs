---
name: beego与gin
sort: 15
---

### beego 支持mvc

- M : Model,即beego ORM,对象关系映射,以及对象的持久化

特性:

	支持go的所有类型存储
	更简单的CRUD(增删改查)
	完整实现健壮稳定的ORM

- V: view	,体现为模版,beego通过处理模版和渲染模版展现视图

特性:

	静态文件处理
	模版处理
	模版分页处理
	
- C: Controller,体现为各种功能

特性:
	
	路由功能
	控制器函数
	CSRF(Cross-Site request forgery)过滤器  跨站攻击
	session
	错误处理&日志功能
	

### Gin不支持mvc
	
	需要开发者自己实现MVC
	
特性:

	HTML 渲染和模版
	静态文件服务
	路由
	...
	
### 路由功能

	beego支持正则路由,gin不支持正则路由
	
Beego:
	
	RESTful Controller路由
		
	
	