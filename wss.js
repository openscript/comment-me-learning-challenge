import { WebSocketServer } from 'ws';
import Comment from './models/comment.js';

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', async (socket) => {
  socket.send(JSON.stringify({ type: "all_comments", data: await Comment.findAll()}))
  socket.on('message', message => console.log(message));
});

Comment.afterSave((r) => {
  wss.clients.forEach((c) => {
    c.send(JSON.stringify({ type: "new_comment", data: r }));
  })
})

export default wss;
