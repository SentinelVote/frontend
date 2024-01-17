package main

import (
	"fmt"
	"github.com/zbohm/lirisi/client"
)

func main() {
	status, privateKey := client.GeneratePrivateKey("prime256v1", "PEM")
	_ = status // TODO: handle error
	fmt.Println(string(privateKey))
}
