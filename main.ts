import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";

// Minimal OpenAI chat agent
const llm = new ChatOpenAI({
    apiKey: Deno.env.get("OPENAI_API_KEY"),
    model: "gpt-3.5-turbo",
});

async function main() {
    console.log("\n🤖 Simple Deno + OpenAI Agent");
    console.log("Type 'exit' to quit.\n");
    // Conversation memory as state
    const messages: BaseMessage[] = [];
    while (true) {
        const input = prompt("You: ");
        if (!input) continue;
        if (input.toLowerCase() === "exit") break;
        messages.push(new HumanMessage(input));
        const response = await llm.invoke(messages);
        if (response && typeof response.content === "string") {
            console.log("Agent:", response.content, "\n");
            messages.push(response);
        } else {
            console.log("Agent: [No response]\n");
        }
    }
}

main();
