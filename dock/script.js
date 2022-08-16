let dragged = null;

var btn = document.getElementById("btn");

var count = 0;

btn.addEventListener('click', function () {
  window.location.href = 'https://cloud-native-dojo.github.io/front-moc-2022/earth/earth.html';
}, false);

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

/*
function moveNewPage() {
  var url = document.URL;
  var count = 0;
  if (url.match(/separate/)) {
    count++;
    if (url.match(/\?/)) {
      location.href = url + "&addShip=" + count;
    } else {
      location.href = url + "?addShip=" + count;
    }
  }
}
 */


function moveNewPage() {
  var url = "https://cloud-native-dojo.github.io/front-moc-2022/earth/earth.html"
  count++;

  window.location.href = url + "?addShip=" + String(count);
}
