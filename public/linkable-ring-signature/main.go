package main

import (
	"fmt"
	"github.com/zbohm/lirisi/client"
	"syscall/js"
	_ "syscall/js"
)

var document js.Value

func main() {
	document = js.Global().Get("document")

	status, privateKey := client.GeneratePrivateKey("prime256v1", "PEM")
	fmt.Println("client.GeneratePrivateKey(): ", status)
	SetValue("pk", "innerHTML", string(privateKey))
	fmt.Println("Print from Go: ", string(privateKey))

	status, publicKey := client.DerivePublicKey(privateKey, "PEM")
	fmt.Println("client.DerivePublicKey(): ", status)
	SetValue("sk", "innerHTML", string(publicKey))
	fmt.Println("Print from Go: ", string(publicKey))
}

// SetValue sets the value of the specified element.
func SetValue(elem string, key string, value string) {
	getElementById(elem).Set(key, value)
}

// getElementById returns the element with the specified ID.
func getElementById(elem string) js.Value {
	return document.Call("getElementById", elem)
}
