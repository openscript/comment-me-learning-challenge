const socket = new WebSocket(
  "ws://localhost:3000"
);

const commentsDisplay = document.getElementById('comments-display');

function appendComment(c) {
  const comment = document.createElement('div');
  const commentHeader = document.createElement('header');
  commentHeader.innerText = `${c.username} schreibt:`;
  const commentBody = document.createElement('div');
  commentBody.innerText = c.message;
  const commentFooter = document.createElement('footer');
  commentFooter.innerText = `Am xy von ${c.origin}`;
  comment.appendChild(commentHeader);
  comment.appendChild(commentBody);
  comment.appendChild(commentFooter);
  commentsDisplay.appendChild(comment);
}

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);

  if (message.type === 'all_comments') {
    const comments = message.data;
    commentsDisplay.innerText = '';
    comments.forEach((c) => {
      appendComment(c);
    })
  }

  if (message.type === 'new_comment') {
    appendComment(message.data);
  }
});
