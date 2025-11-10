// websocket server for responding back to the user
import express from 'express'
import { WebSocketServer, WebSocket } from 'ws'
import { createClient } from 'redis';
const app = express()

app.use(express.json());
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
}))
const redis = createClient({
  url: 'redis://localhost:6379'
});

const httpServer = app.listen(8080, () => {
  console.log('Server is running on port 8080');
})


const wss = new WebSocketServer({ server: httpServer }); // new ws server instance

wss.on('connection', function connection(socket) { // new connection from browser
  console.log('New WS client connected');
  socket.send('Hello! Message From Websocket Server!!'); // send message to the browser
});


async function subscribeToRedis() {
  try {
    await redis.connect();

    await redis.subscribe('problem_done', (message: string) => {
      console.log('Received message from Pub/Sub:', message);

      wss.clients.forEach((client: WebSocket) => {
        if(client.readyState === WebSocket.OPEN){
          client.send(message);
        }
      })
    });
  }
  catch(e){
    console.error('Error connecting to Redis:', e);
  }
}

subscribeToRedis();
function cors(arg0: { origin: string; methods: string; }): any {
  throw new Error('Function not implemented.');
}

