package main

import (
	"fmt"
	"syscall/js"

	"github.com/zbohm/lirisi/client"
	"github.com/zbohm/lirisi/ring"
)

var document js.Value

// Ideally, having main() return two strings would be better,
// but doing so is complex, less efficient, and harder to understand.
//
// The point here is that the generation of keys can be done client-side.
func main() {
	document = js.Global().Get("document")

	status, privateKey := client.GeneratePrivateKey("prime256v1", "PEM")
	if status != ring.Success {
		fmt.Println(`Unable to generate a private key: `, status)
	}

	fmt.Println("Print from Go: ", string(privateKey))
	SetValue("sk", "innerHTML", string(privateKey))

	status, publicKey := client.DerivePublicKey(privateKey, "PEM")
	if status != ring.Success {
		fmt.Println("Unable to derive a public key: ", status)
	}

	fmt.Println("Print from Go: ", string(publicKey))
	SetValue("pk", "innerHTML", string(publicKey))
}

// SetValue sets the value of the specified element.
func SetValue(elem string, key string, value string) {
	getElementById(elem).Set(key, value)
}

// getElementById returns the element with the specified ID.
func getElementById(elem string) js.Value {
	return document.Call("getElementById", elem)
}
