# Deno + OpenAI Interactive Agent Boilerplate

A minimal, ready-to-use boilerplate for building conversational AI agents that run in the terminal.
Built with Deno for simplicity and OpenAI for powerful language capabilities.

This is a minimal boilerplate for building an interactive terminal agent using Deno and OpenAI (via LangChain.js).

## Features
- Deno native (no Node.js required)
- Simple interactive chat agent in the terminal
- Uses OpenAI GPT (via LangChain.js)
- Answer streaming
- Conversation memory

## Setup
1. Install [Deno](https://deno.com/manual/getting_started/installation) if you haven't already.
2. Get an OpenAI API key from https://platform.openai.com/api-keys
3. Set your API key in your environment and save it to your `.env` file as `OPENAI_API_KEY` var

## Usage
Run the agent interactively:

```sh
deno task main
```

Type your message and press Enter. Type `exit` to quit.

## Customization
- Edit `main.ts` to change the prompt, model, or add more logic.

---
This repo is a starting point for Deno + OpenAI terminal agents.