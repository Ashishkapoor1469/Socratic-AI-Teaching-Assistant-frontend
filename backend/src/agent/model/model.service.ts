import { Injectable } from "@nestjs/common";
import Ollama from "ollama";

@Injectable()
export class ModelService {


    async *chatStream(messages): AsyncGenerator<string> {
        console.log("model service: ", messages)
        const stream = await Ollama.chat({
            model: "gpt-oss:120b-cloud",
            messages,
            stream: true,
        });

        for await (const chunk of stream) {
         
            yield chunk.message.content
        }
    }

    async research(messages, onChunk?: (chunk: string) => void): Promise<unknown> {
        const stream = await Ollama.chat({
            model: "gpt-oss:120b-cloud",
            messages,
            format: "json",
            stream: true,
        });

        let fullContent = "";
        for await (const chunk of stream) {
            const text = chunk.message.content;
            fullContent += text;
            onChunk?.(text);
        }

        return JSON.parse(fullContent);
    }

    async vision(prompt: string, imagePath: string, onChunk?: (chunk: string) => void): Promise<string> {
        const stream = await Ollama.chat({
            model: "qwen3.5:397b-cloud",
            messages: [{ role: "user", content: prompt, images: [imagePath] }],
            stream: true,
        });

        let fullContent = "";
        for await (const chunk of stream) {
            const text = chunk.message.content;
            fullContent += text;
            onChunk?.(text);
        }

        return fullContent;
    }
}