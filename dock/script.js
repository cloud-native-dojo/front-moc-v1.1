let dragged = null;

function onDragStart(event) {
  event
    .dataTransfer
    .setData('text/plain', event.target.id);
  dragged = event.target;
}

function onDragOver(event) {
  event.preventDefault();
}

function onDrop(event) {
  event.preventDefault();

  if (event.target.className === "dropzone") {
    console.log("1");
    const clone = dragged.cloneNode(true);
    event.target.appendChild(clone);
  }
  else if (event.target.className === "example-origin") {
    console.log("2");
    dragged.parentNode.removeChild(dragged);
  }
}


function onDragEnd(event) {
}
