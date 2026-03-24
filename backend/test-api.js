// test-api.js
async function testChat() {
    const response = await fetch("http://localhost:3000/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "what is a computer register how it works" })
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n\n").filter(Boolean)

        for (const line of lines) {
            if (line.startsWith("data: ")) {
                const data = line.replace("data: ", "")
                if (data === "[DONE]") {
                    console.log("\n[Stream complete]")
                    return
                }
                const parsed = JSON.parse(data)
                process.stdout.write(parsed.text)
            }
        }
    }
}

testChat().catch(console.error)