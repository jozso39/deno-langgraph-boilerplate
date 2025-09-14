# Deno + OpenAI Interactive Agent Boilerplate

A minimal, ready-to-use boilerplate for building conversational AI agents that run in the terminal. Built with Deno for simplicity and OpenAI for powerful language capabilities.

This is a minimal boilerplate for building an interactive terminal agent using Deno and OpenAI (via LangChain.js).

## Features
- Deno native (no Node.js required)
- Simple interactive chat agent in the terminal
- Uses OpenAI GPT (via LangChain.js)

## Setup
1. Install [Deno](https://deno.com/manual/getting_started/installation) if you haven't already.
2. Get an OpenAI API key from https://platform.openai.com/api-keys
3. Set your API key in your environment:
	 - You can export it in your shell:
		 ```sh
		 export OPENAI_API_KEY=sk-...
		 ```
	 - Or use a `.env` file and run with `--env-file=.env` (Deno v1.41+)

## Usage
Run the agent interactively:

```sh
deno run --allow-net --allow-env main.ts
```

Type your message and press Enter. Type `exit` to quit.

## Customization
- Edit `main.ts` to change the prompt, model, or add more logic.

---
This repo is a starting point for Deno + OpenAI terminal agents.