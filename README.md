# AI Devs 4 — Craft starter

Minimal Node.js starter that runs a small **agent loop** against the **OpenAI Responses API**. It uses tool calling (example: `sum`) and writes a full **JSON trace** of each run under `logs/` at the project root.

**OpenRouter:** `config.js` already sketches provider switching and env vars for OpenRouter, but the OpenRouter path is **not ready yet** — use **OpenAI** for now.

## Requirements

- **Node.js 24+** (enforced in `config.js`)

## Setup

1. Clone or copy this repo.

2. Create a **`.env`** file in the project root (next to `package.json`). You need an **OpenAI** key:

   | Variable | Purpose |
   |----------|---------|
   | `OPENAI_API_KEY` | OpenAI API key (`sk-...`) |

   `OPENROUTER_API_KEY`, `AI_PROVIDER=openrouter`, and related OpenRouter env vars exist in `config.js` for future use; **OpenRouter is not implemented yet.**

3. Install dependencies:

   ```bash
   npm install
   ```

## Run

```bash
npm start
```

This runs `node app.js`: a sample prompt is sent through `src/agent.js`, the model may call tools in `tools/`, and the final answer is printed. On exit, the path to the trace file is printed on stderr.

## Traces

Each run produces a timestamped JSON file in **`logs/`** (repo root), for example `logs/session-<id>--<iso-timestamp>.json`. The tracer records app lifecycle, agent steps, LLM request/response snapshots (redacted where applicable), and tool usage. See the file header comment in `src/trace-logger.js` for event types.

## Project layout

| Path | Role |
|------|------|
| `app.js` | Entry: session id, tracer, sample prompt, `tracer.save()` in `finally` |
| `config.js` | Loads `.env`, resolves provider, exports API endpoints and helpers |
| `src/agent.js` | Tool list, conversation history, loop that calls `chat` |
| `src/ai.js` | HTTP calls to the Responses API (`gpt-4o` by default in code) |
| `src/trace-logger.js` | `createTracer`, redaction helpers, log path under `logs/` |
| `tools/` | Tool modules (each exports a definition + implementation) |

To extend the agent, register tools in `src/agent.js` and implement them under `tools/`. Adjust the user prompt in `app.js` (or wire your own CLI / server).
