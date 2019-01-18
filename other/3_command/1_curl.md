---
name: curl
sort: 0
---

## curl向ip+port post发送json内容

```
curl 127.0.0.1:12345/debug -X POST -H "Content-Type:application/json" -d '{"PprofStart":0,"PprofStop":0,"UseMerge":1,"Compare":1,${url},”Clear”:0}'
```