# Codebase overview and key modules
_Exported on 4/6/2026 at 16:49:21 CDT from Cursor (3.0.12)_

---

**User**

Explain this codebase. Point me to the main entry points, key modules, and anything I should read before making changes.

---

**Cursor**


Exploring the project structure and key files to produce an accurate overview.




## What this repo is

This is a **minimal Node.js (ESM) starter** for the **AI Devs 4 “Craft”** track: a short **agent loop** that talks to the **OpenAI Responses API** (`POST /v1/responses`), supports **function calling** via tools under `tools/`, and writes a **JSON trace** of each run to `logs/`. The README states **OpenRouter is sketched in config but not implemented end-to-end** — expect **OpenAI** to work today.

---

## Main entry point

- **`app.js`** — Only runnable entry (`npm start` → `node app.js`). It creates a session id and tracer, calls `agent()` with a hard-coded sample prompt, prints the answer, and always **`tracer.save()`** in `finally` (trace path on stderr).

```1:24:c:\Users\rafal\repos\4th-devs-craft-starter\app.js
import { createTracer } from "./src/trace-logger.js";
import { agent } from "./src/agent.js";

const sessionId = `session-${Date.now()}`;
const tracer = createTracer(sessionId);

tracer.record("app.start", { sessionId });

const prompt = "What is 47.2 plus 93?";

try {
  const answer = await agent(
    prompt,
    { tracer }
  );
  console.log(answer);
  tracer.record("app.done", { ok: true });
} catch (err) {
  tracer.record("app.error", { message: err?.message ?? String(err) });
  throw err;
} finally {
  const logPath = await tracer.save();
  console.error("Trace log:", logPath);
}
```

There is no separate CLI or HTTP server yet; **your “app boundary” is `app.js`** unless you add one.

---

## Key modules (read in this order)

| File | Role |
|------|------|
| **`src/agent.js`** | Registers tools, keeps **`history`**, runs up to **10** LLM steps: `chat()` → append model output → if there’s a final **message**, return it; else **`execute()`** tool calls and push `function_call_output` items. |
| **`src/ai.js`** | **`chat(history, definitions, tracer)`**: builds the request (`model: "gpt-4o"`, `input`, `tools`), **`fetch`** to **`RESPONSES_API_ENDPOINT`**, parses `output` for `message` vs `function_call`. |
| **`config.js`** | Loads **`.env`**, enforces **Node ≥ 24** and an API key, resolves **`AI_PROVIDER`**, exports **`AI_API_KEY`**, **`RESPONSES_API_ENDPOINT`**, headers/helpers for future OpenRouter, etc. **Imported as a side effect** wherever you need env/bootstrap. |
| **`src/trace-logger.js`** | **`createTracer`**, **`redactSecrets`**, **`tracer.record`**, **`tracer.save()`** → timestamped JSON under **`logs/`**. The **file header** documents **event type** names (`app.*`, `agent.*`, `llm.*`, `tool.*`, …). |
| **`tools/*.js`** | Each tool exports **`definition`** (Responses-style function tool) and **`execute(args, tracer)`** — see **`tools/sum.js`**. |

---

## What to read before you change things

1. **`README.md`** — Setup (`.env`, `OPENAI_API_KEY`), layout table, trace behavior.
2. **`.env.example`** (and your local **`.env`**) — What `config.js` expects; changing providers touches **`config.js`** and possibly **`src/ai.js`**.
3. **`src/trace-logger.js` header (lines 1–28)** — So new layers use consistent **`tracer.record("layer.event", …)`** types.
4. **`docs/openai.md`** — Large **Responses API** reference dump; useful if you extend request/response handling in **`src/ai.js`** (e.g. more output types, plugins).

---

## Common change paths

- **New tool**: add `tools/yourtool.js` (definition + `execute`), import it in **`src/agent.js`**, push onto the **`tools`** array.
- **Model / request shape**: today the model string lives in **`src/ai.js`**; endpoint and key come from **`config.js`**.
- **Prompt / wiring**: **`app.js`** (or replace with CLI/server and still pass `{ tracer }` into **`agent`** if you want traces).

**Runtime constraint:** **`package.json`** and **`config.js`** expect **Node 24+**.

