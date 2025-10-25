import {
    BaseMessage,
    HumanMessage,
    SystemMessage,
} from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { generateGraphPng } from "./utils/visualize-graph.ts";

const model = new ChatOpenAI({
    apiKey: Deno.env.get("OPENAI_API_KEY"),
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    streaming: true,
});

const systemMessageText =
    "You are a helpful assistant. Be concise and friendly in your responses.";

/**
 * Invokes the model with the current state messages, prepending a system message.
 */
async function callModel(state: typeof MessagesAnnotation.State) {
    const systemMessage = new SystemMessage(systemMessageText);
    const messagesWithSystem = [systemMessage, ...state.messages];
    const response = await model.invoke(messagesWithSystem);
    return { messages: [response] };
}

/**
 * Simple conditional logic - always end after model call
 */
function shouldContinue(_state: typeof MessagesAnnotation.State) {
    return "__end__";
}

const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addEdge("__start__", "agent")
    .addConditionalEdges("agent", shouldContinue);

const app = workflow.compile();

async function main() {
    await generateGraphPng(app);

    console.log("\n🤖 Simple Deno + LangGraph + OpenAI Agent");
    console.log("Type 'exit' to quit.\n");

    let messages: BaseMessage[] = [];

    while (true) {
        const input = prompt("You: ");
        if (!input) continue;
        if (input.toLowerCase() === "exit") break;

        messages.push(new HumanMessage(input));

        try {
            console.log("Agent: ");
            const eventStream = app.streamEvents(
                { messages },
                { version: "v2" },
            );

            let isStreaming = false;
            let finalMessages: BaseMessage[] = [];

            for await (const event of eventStream) {
                if (
                    event.event === "on_chat_model_stream" &&
                    event.data?.chunk?.content
                ) {
                    isStreaming = true;
                    const token = event.data.chunk.content;
                    Deno.stdout.writeSync(new TextEncoder().encode(token));
                }
                if (
                    event.event === "on_chain_end" && event.name === "LangGraph"
                ) {
                    finalMessages = event.data.output.messages;
                }
            }
            if (isStreaming) {
                console.log("\n");
            }

            // Update messages with final state
            if (finalMessages.length > 0) {
                messages = finalMessages;
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
}

main();
