"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/submit', async (req, res) => {
    try {
        const { problemId, userId, code, language } = req.body;
        await client.lPush("submissions", JSON.stringify({ problemId, userId, code, language })); // pushes to queue
        res.status(200).json({ message: "Submission received" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to store submission" });
    }
});
app.get('/', (req, res) => {
    res.status(200).json({ message: "Hello World" });
});
async function startServer() {
    try {
        await client.connect(); // connects to redis
        console.log("connected to redis");
        app.listen(3000, () => {
            console.log("server is running on port 3000");
        });
    }
    catch (error) {
        console.error("failed to connect to redis", error);
    }
}
startServer();
//# sourceMappingURL=index.js.map