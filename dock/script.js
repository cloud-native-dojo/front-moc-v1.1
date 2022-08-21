let dragged = null;

var btn = document.getElementById("btn");

var ShipNum;
var IslandNum;

window.onload = getCount();

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

//urlのパラメーター取得
function GetQueryString() {
  if (1 < document.location.search.length) {
    var query = document.location.search.substring(1);
    var parameters = query.split('&');

    var result = new Object();
    for (var i = 0; i < parameters.length; i++) {
      var element = parameters[i].split('=');

      var paramName = decodeURIComponent(element[0]);
      var paramValue = decodeURIComponent(element[1]);

      result[paramName] = decodeURIComponent(paramValue);
    }
    return result;
  }
  return null;
}

//船と島の個数確認
function getCount() {
  var params = GetQueryString();

  IslandNum = params["IslandNum"];
  ShipNum = params["ShipNum"];

  console.log(IslandNum);
  console.log(ShipNum);
}

function onDragEnd(event) {
}

function moveNewPage() {
  var url = "https://cloud-native-dojo.github.io/front-moc-2022/earth/earth.html"
  ShipNum++;

  window.location.href = url + "?ShipNum=" + String(ShipNum);
}


//Podのデータを取得する関数
async function getPodData() {
  let response = await fetch("http://127.0.0.1:8000/pods/");

  if (response.ok) {
    let json = await response.json();
    console.log(json);
  } else {
    alert("HTTP-Error: " + response.status);
  }
}


//wordpressが乗ったpodを作成する関数(一時的にwordpressに固定してます)
async function makePod() {
  let pod = {
    "containers": {
      "wordpress": 1
    }
  };

  let makePodResponse = await fetch("http://127.0.0.1:8000/pods/", {
    method: 'POST',
    body: JSON.stringify(pod)
  });

  let result = await response.json();
  alert(result.message);
}
