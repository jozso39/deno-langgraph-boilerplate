import {
    BaseMessage,
    HumanMessage,
    SystemMessage,
} from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import {
    CompiledStateGraph,
    MessagesAnnotation,
    StateGraph,
} from "@langchain/langgraph";
import { loadEnv } from "./utils/loadEnv.ts";
import { generateGraphPng } from "./utils/visualizeGraph.ts";

// OpenAI chat model
const model = new ChatOpenAI({
    apiKey: Deno.env.get("OPENAI_API_KEY"),
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    streaming: true,
});

// System message for the agent
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
    // For this simple example, always end after model response
    return "__end__";
}

// Create the state graph
const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addEdge("__start__", "agent")
    .addConditionalEdges("agent", shouldContinue);

const app = workflow.compile();

async function main() {
    // Load environment variables from .env file
    await loadEnv();

    // visualize the graph
    await generateGraphPng(app);

    console.log("\n🤖 Simple Deno + LangGraph + OpenAI Agent");
    console.log("Type 'exit' to quit.\n");

    let messages: BaseMessage[] = [];

    while (true) {
        const input = prompt("You: ");
        if (!input) continue;
        if (input.toLowerCase() === "exit") break;

        // Add user message to state
        messages.push(new HumanMessage(input));

        try {
            // Run the graph with current messages
            const result = await app.invoke({ messages });

            // Update messages with the result
            messages = result.messages;

            // Get the latest AI response
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && typeof lastMessage.content === "string") {
                console.log("Agent:", lastMessage.content, "\n");
            } else {
                console.log("Agent: [No response]\n");
                console.log("[DEBUG] Last message:", lastMessage);
                console.log("[DEBUG] All messages length:", messages.length);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
}

main();
