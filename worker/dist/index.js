"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
async function main() {
    try {
        await client.connect(); // connects to redis
        console.log("connected to redis");
        while (1) {
            const response = await client.brPop("submissions", 0); // pops from the redis queue
            // Parse the JSON string from the queue
            // @ts-ignore
            const submission = JSON.parse(response?.element || "{}");
            const { problemId, userId, code, language } = submission;
            // await processSubmission(submission); 
            await new Promise(resolve => setTimeout(resolve, 1000));
            // send it to pub/sub
            await client.publish("problem_done", JSON.stringify({ problemId, userId, language, status: "TLE" }));
            console.log("submission processed", submission);
        }
    }
    catch (error) {
        console.error("failed to connect to redis", error);
    }
}
main();
//# sourceMappingURL=index.js.map