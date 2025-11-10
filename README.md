# lc-backend

This repository demonstrates how the LeetCode submission backend conceptually works — but in a simplified way so the entire flow is easy to understand end-to-end.

this repo uses:
- **websockets** (`ws` package)
- **redis queues**
- **redis pub/sub**

> NOTE: real LeetCode uses polling for pushing updates back to the browser.  
> in this repo we use **websockets** instead → persistent full-duplex.

no socket.io is used — only raw `ws`.

---

## architecture

flow: browser (problem_id, code, language) --> primary backend ---> redis queue ---> workers (w1, w2, ...) ---> redis pub/sub ---> websocket server ---> browser (live result)


### components used

| component | purpose |
|----------|---------|
| primary backend | receives submissions & pushes job into queue |
| redis queue | stores pending submissions |
| workers | pulls jobs, runs execution logic |
| redis pub/sub | broadcasts computed results |
| websocket server | keeps persistent WS connections & pushes status back to browser |

---

## why this repo

this repo shows how online-judge “submit → wait → get result” pipelines work.

- async task execution
- decoupled workers
- job queueing
- real time push
- pub/sub event propagation

**BUT** simplified — readable — beginner friendly.

---

## tech stack

- Node.js
- Redis (queue + pub/sub)
- WebSocket (`ws`)

---

## difference vs real LeetCode

| feature | LeetCode (public known) | this repo |
|--------|--------------------------|-----------|
| result delivery | polling | websocket push |
| job pipeline | queues | queues |
| message fan-out | pub/sub | redis pub/sub |
| websocket lib | unknown proprietary | raw `ws` (no socket.io) |

---

## goal

not production.  
not a clone.

learning + architecture clarity.



