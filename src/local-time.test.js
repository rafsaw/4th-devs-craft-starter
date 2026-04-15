import assert from "node:assert/strict";
import test from "node:test";
import { formatLocalDateTime } from "./local-time.js";

test("formatLocalDateTime matches RFC3339-style local offset (no Z)", () => {
  const s = formatLocalDateTime(new Date(2026, 3, 7, 14, 30, 5, 12));
  assert.match(s, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$/);
  assert.ok(!s.endsWith("Z"));
});

test("formatLocalDateTime round-trips through Date", () => {
  const d = new Date(2026, 0, 15, 9, 0, 0, 0);
  const s = formatLocalDateTime(d);
  const again = new Date(s);
  assert.equal(again.getTime(), d.getTime());
});
