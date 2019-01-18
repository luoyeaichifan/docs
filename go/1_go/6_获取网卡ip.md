---
name: 获取网卡ip
sort: 5
---



```
package main

import (
	"fmt"
	"net"
	"strings"
)

func getLocalIp() (string, error) {
	interfaces, err := net.Interfaces()
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	addrMap := make(map[string]string, 0)

	for _, inter := range interfaces {
		addrs, _ := inter.Addrs()

		for _, addr := range addrs {
			if ipnet, ok := addr.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
				if ipnet.IP.To4() != nil {
					addrMap[inter.Name] = strings.Replace(ipnet.IP.String(),".","_",-1)
				}
			}
		}
	}
	if v, ok := addrMap["bond0"]; ok {

		return v, nil
	} else if v, ok := addrMap["eth1"]; ok {
		return v, nil
	} else if v, ok := addrMap["eth2"]; ok {
		return v, nil
	} else {
		return "", fmt.Errorf("get fail")
	}

}

func main() {
	addr, err := getLocalIp()
	fmt.Println(addr, err)

}

	
```