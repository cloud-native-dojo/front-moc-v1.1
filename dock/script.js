let dragged = null;

function onDragStart(event) {
  event
    .dataTransfer
    .setData('text/plain', event.target.id);

    event
    .currentTarget
    .style
    .backgroundColor = 'yellow';
  dragged = event.target;
}

function onDragOver(event) {
  event.preventDefault();
}

function onDrop(event) {
  event.preventDefault();

  if (event.target.className === "dropzone" || event.target.className === "example-origin") {
    dragged.parentNode.removeChild(dragged);
    event.target.appendChild(dragged);
  }
}


function onDragEnd(event) {
    event
    .currentTarget
    .style
    .backgroundColor = '#4AAE9B';
}
