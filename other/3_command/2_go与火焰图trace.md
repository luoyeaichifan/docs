---
name: git 分布式控制系统
sort: 1
---

[参考](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)


- 安装
- 配置

	```
	git config --global user.name "Your Name"
	git config --global user.email "email@example.com"
	```
	因为Git是分布式版本控制系统，所以，每个机器都必须自报家门：你的名字和Email地址。你也许会担心，如果有人故意冒充别人怎么办？这个不必担心，首先我们相信大家都是善良无知的群众，其次，真的有冒充的也是有办法可查的。
	
	注意git config命令的--global参数，用了这个参数，表示你这台机器上所有的Git仓库都会使用这个配置，当然也可以对某个仓库指定不同的用户名和Email地址。
	
- 创建版本库

	```
	$ mkdir learngit
	$ cd learngit
	$ pwd
	/Users/michael/learngit
	$ git init
	Initialized empty Git repository in /Users/michael/learngit/.git/
	```
	
- 把文件添加到版本库

	```
	touch readme.txt
	git add readme.txt
	git commit -m "add readme.txt"
	```
	为什么Git添加文件需要add，commit一共两步呢？因为commit可以一次提交很多文件，所以你可以多次add不同的文件
	
- 查看工作区状态、修改内容

	```
	git status
	git diff
	```
	
- 查看历史数据

	```
	git log --pretty-oneline
	```	
	
	```git reflog```记录你的每一次命令
	
- 版本回退

	`HEAD`表示当前版本
	
	上一个版本就是`HEAD^`
	
	上上一个版本就是`HEAD^^`
	
	当然往上100个版本写100个^比较容易数不过来，所以写成`HEAD~100`
	
	```git reset --hard HEAD^```会退到上一个版本
	
- 工作区与暂存区

	git add把文件添加进去，实际上就是把文件修改添加到暂存区；

	git commit提交更改，实际上就是把暂存区的所有内容提交到当前分支。
	
- 撤销修改

	`git checkout -- readme.txt`意思就是，把readme.txt文件在工作区的修改全部撤销
	就是让这个文件回到最近一次git commit或git add时的状态
	
	`git reset HEAD <file>`可以把暂存区的修改撤销掉（unstage），重新放回工作区

- 删除文件

	小提示：先手动删除文件，然后使用git rm <file>和git add<file>效果是一样的。
	
	另一种情况是删错了，因为版本库里还有呢，所以可以很轻松地把误删的文件恢复到最新版本：

	```git checkout -- test.txt```
	git checkout其实是用版本库里的版本替换工作区的版本，无论工作区是修改还是删除，都可以“一键还原”
	
- 远程仓库
	- 在github上面创建仓库

	- 本地与远程仓库建立联系
	
		Git仓库和GitHub仓库之间的传输是通过SSH加密的，所以，需要一点设置：
		第1步：创建SSH Key。在用户主目录下，看看有没有.ssh目录，如果有，再看看这个目录下有没有id_rsa和id_rsa.pub这两个文件，如果已经有了，可直接跳到下一步。如果没有，打开Shell（Windows下打开Git Bash），创建SSH Key：`ssh-keygen -t rsa -C "youremail@example.com"`
	
		你需要把邮件地址换成你自己的邮件地址，然后一路回车，使用默认值即可，由于这个Key也不是用于军事目的，所以也无需设置密码。

		如果一切顺利的话，可以在用户主目录里找到.ssh目录，里面有id_rsa和id_rsa.pub两个文件，这两个就是SSH Key的秘钥对，id_rsa是私钥，不能泄露出去，id_rsa.pub是公钥，可以放心地告诉任何人。

		第2步：登陆GitHub，打开“Account settings”，“SSH Keys”页面：

		然后，点“Add SSH Key”，填上任意Title，在Key文本框里粘贴id_rsa.pub文件的内容
	- 本地已有仓库与远程仓库建立联系

		在本地的learngit仓库下运行命令：

		`git remote add origin git@github.com:michaelliao/learngit.git`
		
		远程库的名字就是origin，这是Git默认的叫法，也可以改成别的，但是origin这个名字一看就知道是远程库
		
	- 本地内容推送到远程库

		`git push -u origin master`
	
		把本地库的内容推送到远程，用git push命令，实际上是把当前分支master推送到远程。由于远程库是空的，我们第一次推送master分支时，加上了-u参数，Git不但会把本地的master分支内容推送的远程新的master分支，还会把本地的master分支和远程的master分支关联起来，在以后的推送或者拉取时就可以简化命令。
		
		
