# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install   # install dependencies
npm start     # run the agent (node app.js)
npm test      # run tests
```

## Requirements

Node.js 24+ is enforced at startup in `config.js`.

## Environment

Copy `.env.example` to `.env`. At least one API key is required:
- `OPENAI_API_KEY` — primary; provider defaults to `openai` when this key is present
- `OPENROUTER_API_KEY` — alternative; set `AI_PROVIDER=openrouter` to force it


## Architecture

### Agent loop (`app.js` → `src/agent.js` → `src/ai.js`)

`app.js` is the entry point: creates a session id and tracer, runs `agent()`, saves the trace in `finally`. The agent loop in `src/agent.js` maintains a `history` array, calls `chat()` up to 10 times, dispatches tool calls via `execute()`, and returns the first text message from the model. `src/ai.js` posts to the OpenAI Responses API (`gpt-4o`) and extracts `message` and `calls` from the response `output` array.

**To add a tool:** implement a module under `tools/` that exports `definition` (OpenAI function schema) and `execute(args, tracer)`, then import and register it in the `tools` array in `src/agent.js`.

### Configuration (`config.js`)

Loads `.env`, resolves `AI_PROVIDER` (openai or openrouter), and exports `AI_API_KEY`, `RESPONSES_API_ENDPOINT`, `CHAT_API_BASE_URL`, and `buildResponsesRequest()`. `buildResponsesRequest()` handles provider-specific model name normalization and web search options (OpenAI `web_search_preview` tool vs. OpenRouter `:online` suffix / `web` plugin).

Note: OpenRouter is structurally prepared but not fully implemented — use OpenAI.

### Tracer (`src/trace-logger.js`)

Pass `{ tracer }` as options to any function that should emit events. Call `tracer.record(type, data)` at each meaningful step. `tracer.save()` writes a single JSON file to `logs/`. Use `redactSecrets()` when recording headers or request objects. Event type namespaces: `app.*`, `agent.*`, `llm.*`, `tool.*`, `integration.*`, `verify.*`, `validation.*`.

