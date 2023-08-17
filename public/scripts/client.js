const socket = new WebSocket(`ws://${location.host}`);

const commentsDisplay = document.getElementById('comments-display');

function prependComment(c) {
  const comment = document.createElement('div');
  const commentHeader = document.createElement('header');
  commentHeader.innerText = `Am ${new Date(c.createdAt).toLocaleString()} von ${c.origin} schreibt ${c.username}:`;
  const commentBody = document.createElement('div');
  commentBody.innerText = c.message;
  comment.appendChild(commentHeader);
  comment.appendChild(commentBody);
  commentsDisplay.prepend(comment);
}

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);

  if (message.type === 'all_comments') {
    const comments = message.data;
    commentsDisplay.innerText = '';
    comments.forEach((c) => {
      prependComment(c);
    })
  }

  if (message.type === 'new_comment') {
    prependComment(message.data);
  }
});
