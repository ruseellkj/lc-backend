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


<p align="center">
  <img src="frontend->backend.png" width="750" />
</p>

The above image shows when a user clicks the Submit button (for example on LeetCode or any online judge), the frontend sends a request to the backend with the submission payload. The backend does not execute the code directly — instead, it enqueues the submission into a Redis queue. A set of worker machines (e.g. EC2 instances / servers) continuously pull tasks from the queue and run the business logic / code execution sandbox for each submission.

<p align="center">
  <img src="backend->frontend.png" width="750" />
</p>

Once the workers finish executing the submission, they publish the result/verdict to a Redis Pub/Sub channel.

The reason for using Pub/Sub: there are multiple WebSocket servers running (horizontally scaled), and the worker does not know which WebSocket instance currently holds the client connection. Publishing to a Pub/Sub channel solves this routing problem.

Each WebSocket server maintains persistent, full-duplex connections to clients and is subscribed to the Pub/Sub channel — so as soon as the result is published, the appropriate WebSocket server pushes the final verdict back to the correct client in real-time.


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

- Next.js
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



