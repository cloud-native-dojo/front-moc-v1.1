let dragged = null;

var btn = document.getElementById("btn");

var ShipNum;
var IslandNum;

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

function onDragEnd(event) {
}

async function moveNewPage() {
  var url = "https://cloud-native-dojo.github.io/front-moc-2022/earth/earth.html"
  makepod('http://127.0.0.1:8000/pods/',
    {
      "containers": {
        "wordpress": 1
      }
    })
    .then(data => {
      console.log(data); // `data.json()` の呼び出しで解釈された JSON データ
      window.location.href = url;
    });
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
async function makepod(url = '', data = {}) {
  // 既定のオプションには * が付いています
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // 本文のデータ型は "Content-Type" ヘッダーと一致させる必要があります
  })
  return response.json(); // JSON のレスポンスをネイティブの JavaScript オブジェクトに解釈
}
