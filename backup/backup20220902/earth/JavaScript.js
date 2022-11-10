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
var all_dock = [document.getElementById("island1_dock"),
document.getElementById("island2_dock"),
document.getElementById("island3_dock"),
document.getElementById("island4_dock")]
var ship_box = document.getElementById("ship_box").getBoundingClientRect();
var delete_box = document.getElementsByClassName("delete_ship")[0].getBoundingClientRect();

var ship_rect = [];

for (var i = 0; i < island.length; i++) {
  island[i][0].style.visibility = "hidden";
  all_ports[i].style.visibility = "hidden";
}

var onisland1 = 0;
var onisland2 = 0;
var onisland3 = 0;
var onisland4 = 0;

const cyrb53 = function (str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

(async function () {
  let response = await fetch("http://10.204.227.162:8000/pods/");

  if (response.ok) {
    let pods = (await response.json()).pods;
    if (pods[0] != "") {
      console.log(pods);
      for (var i = 0; i < pods.length; i++) {
        var ship_element = document.getElementById('ships');
        var ship = document.createElement("div");
        ship.className = "ship";
        ship.id = pods[i];

        let bgcode = cyrb53(pods[i]);

        bgcode = "#" + String(bgcode).slice(3, 9);

        console.log(bgcode);

        // 指定した色からR/G/Bをそれぞれ取得
        const red = parseInt(bgcode.substr(1, 2), 16);
        const green = parseInt(bgcode.substr(3, 2), 16);
        const blue = parseInt(bgcode.substr(5, 2), 16);

        // 明るさの計算(0〜255)
        const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
        // 明るさの計算(0〜100)
        const luminance = brightness / 2.55

        // 基準値(50)より大きい場合は、黒を返し、それ以外は白を返す
        let text_color =  luminance > 50 ? "#000000" : "#ffffff";
        console.log(text_color);
        if (luminance > 50) {
          ship.innerHTML = "<div style='background:" + bgcode + ";width:120px;height:140px;'><img src=\"https://cdn-icons-png.flaticon.com/512/870/870056.png\" width=\"100\" height=\"100\"><p style='color:" + text_color + ";font-weight: bold;margin-top: -25px;'>" + pods[i] +"</p><div>";
        }
        else {
          ship.innerHTML = "<div style='background:" + bgcode + ";width:120px;height:140px;'><img src=\"https://cdn-icons-png.flaticon.com/512/870/870056.png\" width=\"100\" height=\"100\"><p style='color:" + text_color + ";font-weight: bold;margin-top: -25px;filter: invert(100%);'>" + pods[i] + "</p><div>";
        }

        ship_element.appendChild(ship);
      }
    }
  } else {
    alert("HTTP-Error: " + response.status);
  }


  let get_ports = await fetch("http://10.204.227.162:8000/ports_suggest/");

  if (get_ports.ok) {
    let ports = (await get_ports.json()).sugessted_port;
    console.log(ports);
    for (var i = 0; i < all_ports.length; i++) {
      all_ports[i].innerText = "port:" + ports[i];
    }
  } else {
    alert("HTTP-Error: " + response.status);
  }

  let get_save = await fetch("http://10.204.227.162:8000/save/");

  if (get_save.ok) {
    let save_data = (await get_save.json()).data;
    console.log(save_data);
    for (let i = 0; i < island.length; i++) {
      island[i][0].style.visibility = save_data.island[i];
      all_ports[i].style.visibility = save_data.island[i];
      all_dock[i].style.visibility = save_data.island[i];
    }
    for (let i = 0; i < elements.length; i++) {
      try {
        elements[i].style.top = save_data.ship[elements[i].id].split(" ")[0] + "px";
        elements[i].style.left = save_data.ship[elements[i].id].split(" ")[1] + "px";
      } catch (e) { }
      ship_rect[i] = elements[i].getBoundingClientRect();
    }
  } else {
    alert("HTTP-Error: " + response.status);
  }
  check_island();
  save();
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
    } catch (e) {

    }

    //ムーブベントハンドラの消去
    try {
      document.body.removeEventListener("mousemove", mmove, false);
      drag.removeEventListener("mouseup", mup, false);
      document.body.removeEventListener("touchmove", mmove, false);
      drag.removeEventListener("touchend", mup, false);
    } catch (e) { }

    for (let i = 0; i < elements.length; i++) {
      ship_rect[i] = elements[i].getBoundingClientRect();
    }

    //check_island();

    save();

    //クラス名 .drag も消す
    try {
      drag.classList.remove("drag");
    } catch (e) { }
  }

})()


function check_island() {
  for (let j = 0; j < island_rect.length; j++) {
    island[j][0].style.backgroundColor = '#CCCCCC';
    island[j][0].classList.remove("bind");
  }


  for (let j = 0; j < island_rect.length; j++) {
    for (let i = 0; i < elements.length; i++) {

      console.log(delete_box.top);
      console.log(delete_box.right);
      if (detectCollision(ship_rect[i], delete_box)) {
        console.log(elements[i].id);
        deleteShip(elements[i].id);
        elements[i].remove();
      }
      if (detectCollision(ship_box, ship_rect[i]) == false
        && detectCollision(island_rect[j], ship_rect[i])
        && island[j][0].classList.contains("bind") == false
        && window.getComputedStyle(island[j][0]).visibility == "visible") {
        if (j == 0) {
          elements[i].style.top = 230 +  "px";
          elements[i].style.left = 720 + "px";
        }
        if (j == 1) {
          elements[i].style.top = 680 + "px";
          elements[i].style.left = 1000 + "px";
        }
        if (j == 2) {
          elements[i].style.top = 680 + "px";
          elements[i].style.left = 750 + "px";
        }
        if (j == 3) {
          elements[i].style.top = 230 + "px";
          elements[i].style.left = 1050 + "px";
        }
        island[j][0].style.backgroundColor = '#33FF00';

        post_data('http://10.204.227.162:8000/services/',
          {
            // "port": all_ports[j].innerText,
            "port": parseInt(all_ports[j].innerText.replace("port:", ""), 10),
            "name": elements[i].id
          }
        )
          .then(data => {
            console.log(data); // `data.json()` の呼び出しで解釈された JSON データ
          });

        let link = document.getElementById('island' + (j + 1) + '_link');
        console.log(link)
        let url = 'http://10.204.227.151:' + all_ports[j].innerText;
        link.setAttribute('href', url.replace(":port", ""));
        island[j][0].classList.add("bind");
        break;
      } else {
        island[j][0].style.backgroundColor = '#CCCCCC';
        island[j][0].classList.remove("bind");
      }
      if (ship_rect[i].top > document.documentElement.clientHeight) {
        elements[i].style.top = "0px";
      }
      if (ship_rect[i].top < 0) {
        elements[i].style.top = "0px";
      }
      if (ship_rect[i].left > document.documentElement.clientWidth) {
        elements[i].style.left = "0px";
      }
      if (ship_rect[i].left < 0) {
        elements[i].style.left = "0px";
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
  post_data('http://10.204.227.162:8000/save/', save_message
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
  var nextUrl = "http://10.204.227.162/dock/dock.html"

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
  for (var i = island.length - 1; i > -1; i--) {
    if (window.getComputedStyle(island[i][0]).visibility == "visible" && island[i][0].classList.contains("bind") == false) {
      island[i][0].style.visibility = "hidden";
      all_ports[i].style.visibility = "hidden";
      all_dock[i].style.visibility = "hidden";
      save();
      break;
    }
  }
}

function deleteShip(ShipName) {
  delete_data('http://10.204.227.162:8000/pods/',
    {
      "name": ShipName
    })
    .then(data => {
      console.log(data); // `data.json()` の呼び出しで解釈された JSON データ
    });
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

async function delete_data(url = '', data = {}) {
  // 既定のオプションには * が付いています
  const response = await fetch(url, {
    method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
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

//光らせる

window.addEventListener('load', function () {
  for (let i = 0; i < 10; i++) {
    var box = document.querySelector('#pika-box');
    box.classList.add('highlight');


    setTimeout(function () {
      box.classList.remove('highlight');
    }, 50);

    console.log(i)
  }
});
