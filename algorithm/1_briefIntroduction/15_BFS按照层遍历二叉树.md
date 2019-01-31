---
name: BFS按照层遍历二叉树
sort: 15
---

```
给定一个二叉树，返回其按层次遍历的节点值。 （即逐层地，从左到右访问所有节点）。

例如:
给定二叉树: [3,9,20,null,null,15,7],

    3
   / \
  9  20
    /  \
   15   7
返回其层次遍历结果：

[
  [3],
  [9,20],
  [15,7]
]
```

```


func levelOrder(root *TreeNode) [][]int {
	noValue := true

	res := make([][]int, 0)
	layer := make([]*TreeNode, 0 )
	if root == nil {
		return res
	}

	//第一层
	layer = append(layer, root)

	for noValue {
		nextLayer := make([]*TreeNode, 0 )
		layerValue := make([]int, 0)
		//遍历该层
		for _, v := range layer {
			if v != nil {
				layerValue = append(layerValue, v.Val)
				//构造下一层
				nextLayer = append(nextLayer, v.Left)
				nextLayer = append(nextLayer, v.Right)
			}
		}
		if len(layerValue) == 0 {//	该层没有值，证明到底了
			return res
		}else {
			res = append(res, layerValue)
			layer = nextLayer
		}
	}
	return res
}


```