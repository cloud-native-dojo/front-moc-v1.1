var elements = document.getElementsByClassName("ship");
var island = [document.getElementsByClassName("island1"),
              document.getElementsByClassName("island2"),
              document.getElementsByClassName("island3"),
              document.getElementsByClassName("island4")];
var island_rect = [island[0][0].getBoundingClientRect(),
                    island[1][0].getBoundingClientRect(),
                    island[2][0].getBoundingClientRect(),
                    island[3][0].getBoundingClientRect()];
var all_ports = [document.getElementById("island1_port"),
              document.getElementById("island2_port"),
              document.getElementById("island3_port"),
              document.getElementById("island4_port")]
var ship_box = document.getElementById("ship_box").getBoundingClientRect();

var ship_rect = [];

for(var i=0;i < island.length;i++){
  island[i][0].style.visibility = "hidden";
  all_ports[i].style.visibility = "hidden";
}

var onisland1 = 0;
var onisland2 = 0;
var onisland3 = 0;
var onisland4 = 0;

(async function () {
  console.log("test");
  let response = await fetch("http://127.0.0.1:8000/pods/");

  if (response.ok) {
    let pods = (await response.json()).pods;
    console.log(pods);
    for (var i = 0; i < pods.length; i++) {
      var ship_element = document.getElementById('ships');
      var ship = document.createElement("div");
      ship.className = "ship";
      ship.id = pods[i];
      ship.innerHTML = "<img src=\"https://cdn-icons-png.flaticon.com/512/870/870056.png\" width=\"80\" height=\"80\">";
      ship_element.appendChild(ship);
    }
  } else {
    alert("HTTP-Error: " + response.status);
  }

  for (let i = 0; i < elements.length; i++) {
    ship_rect[i] = elements[i].getBoundingClientRect();
  }

  let get_ports = await fetch("http://127.0.0.1:8000/ports_suggest/");

  if (get_ports.ok) {
    let ports = (await get_ports.json()).sugessted_port;
    console.log(ports);
    for (var i = 0; i < all_ports.length; i++) {
      all_ports[i].innerText = ports[i];
    }
  } else {
    alert("HTTP-Error: " + response.status);
  }

  let get_save = await fetch("http://127.0.0.1:8000/save/");

  if (get_save.ok) {
    let save_data = (await get_save.json()).data;
    console.log(save_data);
    for (let i = 0; i < island.length; i++) {
      island[i][0].style.visibility = save_data.island[i];
      all_ports[i].style.visibility = save_data.island[i];
    }
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.top = save_data.ship[elements[i].id].split(" ")[0] + "px";
      elements[i].style.left = save_data.ship[elements[i].id].split(" ")[1] + "px";
    }
  } else {
    alert("HTTP-Error: " + response.status);
  }
  //要素内のクリックされた位置を取得するグローバル（のような）変数
  var x;
  var y;

  //マウスが要素内で押されたとき、又はタッチされたとき発火
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("mousedown", mdown, false);
    elements[i].addEventListener("touchstart", mdown, false);
  }

  //マウスが押された際の関数
  function mdown(e) {

    //クラス名に .drag を追加
    this.classList.add("drag");

    //タッチデイベントとマウスのイベントの差異を吸収
    if (e.type === "mousedown") {
      var event = e;
    } else {
      var event = e.changedTouches[0];
    }

    //要素内の相対座標を取得
    x = event.pageX - this.offsetLeft;
    y = event.pageY - this.offsetTop;

    //ムーブイベントにコールバック
    document.body.addEventListener("mousemove", mmove, false);
    document.body.addEventListener("touchmove", mmove, false);
  }

  //マウスカーソルが動いたときに発火
  function mmove(e) {
    //ドラッグしている要素を取得
    var drag = document.getElementsByClassName("drag")[0];

    //同様にマウスとタッチの差異を吸収
    if (e.type === "mousemove") {
      var event = e;
    } else {
      var event = e.changedTouches[0];
    }

    //フリックしたときに画面を動かさないようにデフォルト動作を抑制
    e.preventDefault();

    //マウスが動いた場所に要素を動かす
    drag.style.top = event.pageY - y + "px";
    drag.style.left = event.pageX - x + "px";

    //マウスボタンが離されたとき、またはカーソルが外れたとき発火
    drag.addEventListener("mouseup", mup, false);
    document.body.addEventListener("mouseleave", mup, false);
    drag.addEventListener("touchend", mup, false);
    document.body.addEventListener("touchleave", mup, false);

  }

  //マウスボタンが上がったら発火
  function mup(e) {
    try {
      var drag = document.getElementsByClassName("drag")[0];
    } catch(e){

    }

    //ムーブベントハンドラの消去
    document.body.removeEventListener("mousemove", mmove, false);
    drag.removeEventListener("mouseup", mup, false);
    document.body.removeEventListener("touchmove", mmove, false);
    drag.removeEventListener("touchend", mup, false);

    for (let i = 0; i < elements.length; i++) {
      ship_rect[i] = elements[i].getBoundingClientRect();
    }

    check_island();
    
    save();

    //クラス名 .drag も消す
    drag.classList.remove("drag");
  }

})()


function check_island() {
  for (let j = 0; j < island_rect.length; j++) {
    island[j][0].style.backgroundColor = '#CCCCCC';
    island[j][0].classList.remove("bind");
  }
  for (let j = 0; j < island_rect.length; j++) {
    for (let i = 0; i < elements.length; i++) {
      if (detectCollision(ship_box, ship_rect[i])) {
        console.log("in_box")
      }
      else if (detectCollision(island_rect[j], ship_rect[i]) && island[j][0].classList.contains("bind") == false && window.getComputedStyle(island[j][0]).visibility == "visible") {
        console.log(island[j][0].classList.contains("bind"));
        elements[i].style.top = island_rect[j].top + (island_rect[j].bottom - island_rect[j].top) / 4 + "px";
        elements[i].style.left = island_rect[j].left + (island_rect[j].right - island_rect[j].left) / 4 + 20 + "px";
        island[j][0].style.backgroundColor = '#33FF00';

        post_data('http://127.0.0.1:8000/services/',
          {
            "port": all_ports[j].innerText,
            "name": elements[i].id
          }
        )
          .then(data => {
            console.log(data); // `data.json()` の呼び出しで解釈された JSON データ
          });

        let link = document.getElementById('island' + (j + 1) + '_link');
        console.log(link)
        let url = 'http://10.204.227.151:' + all_ports[j].innerText;
        link.setAttribute('href', url);
        island[j][0].classList.add("bind");
        break;
      }
    }
  }
}

function detectCollision(rect1, rect2) {
  if (((rect1.left + window.pageXOffset <= rect2.left + window.pageXOffset && rect2.left + window.pageXOffset <= rect1.right + window.pageXOffset) ||
    (rect1.left + window.pageXOffset <= rect2.right + window.pageXOffset && rect2.right + window.pageXOffset <= rect1.right + window.pageXOffset)) &&
    ((rect1.top + window.pageYOffset <= rect2.top + window.pageYOffset && rect2.top + window.pageYOffset <= rect1.bottom + window.pageYOffset) ||
      (rect1.top + window.pageYOffset <= rect2.bottom + window.pageYOffset && rect2.bottom + window.pageYOffset <= rect1.bottom + window.pageYOffset))
  ) {
    return true;
  } else {
    return false;
  }
}

function save() {
  save_message = { "island": {}, "ship": {} };
  for (let i = 0; i < island.length; i++) {
    save_message.island[i] = window.getComputedStyle(island[i][0]).visibility;
  }
  for (let i = 0; i < elements.length; i++) {
    save_message.ship[elements[i].id] = ship_rect[i].top + " " + ship_rect[i].left;
  }
  post_data('http://127.0.0.1:8000/save/', save_message
  )
    .then(data => {
      console.log(data.data); // `data.json()` の呼び出しで解釈された JSON データ
    }
  );
  
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


function moveNewPage() {
  var nextUrl = "https://cloud-native-dojo.github.io/front-moc-2022/dock/dock.html"

  window.location.href = nextUrl;
}

function addIsland() {
  console.log("add");
  island[0][0].classList.toggle('active');
  for (var i = 0; i < island.length; i++) {
    if (window.getComputedStyle(island[i][0]).visibility == "hidden") {
      island[i][0].style.visibility = "visible";
      all_ports[i].style.visibility = "visible";
      save();
      break;
    }
  }
}

function deleteIsland() {
  console.log("delete");
  for (var i = island.length-1; i > -1; i--) {
    if (window.getComputedStyle(island[i][0]).visibility == "visible" && island[i][0].classList.contains("bind") == false) {
      island[i][0].style.visibility = "hidden";
      all_ports[i].style.visibility = "hidden";
      save();
      break;
    }
  }
}

//船を表示させるための関数

async function post_data(url = '', data = {}) {
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