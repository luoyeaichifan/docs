---
name: floyd算法
sort: 36
---



[floyd](https://www.cnblogs.com/GumpYan/p/5540549.html)


求两点间的最短路径

思路:两点间的最短路径,需要介入第三点,或更多点,path[i][j]  观察path[i][k]+path[k][j]是否最短,动态规划问题


```
for k=1;k<=n;k++ {
	for i=1;i<=n;i++ {
		for j=1;j<=n;j++ {
			if path[i][j] > path[i][k] + path[k][j] {
				path[i][j] = path[i][k] + path[k][j]
			}
		}		
	}
}
```

