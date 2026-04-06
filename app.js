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
