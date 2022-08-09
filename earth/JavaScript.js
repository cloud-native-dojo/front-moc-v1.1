(function () {

  //要素の取得
  var elements = document.getElementsByClassName("ship");
  var island = [document.getElementsByClassName("island1"),
                document.getElementsByClassName("island2"),
                document.getElementsByClassName("island3"),
                document.getElementsByClassName("island4")];
  var island_rect = [island[0][0].getBoundingClientRect(), 
                     island[1][0].getBoundingClientRect(), 
                     island[2][0].getBoundingClientRect(), 
                     island[3][0].getBoundingClientRect()];
  var house = document.getElementsByClassName("house")[0];
  var house_rect = house.getBoundingClientRect();
  var onisland1 = 0;
  var onisland2 = 0;
  var onisland3 = 0;
  var onisland4 = 0;

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
    console.log("mdown");

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
    console.log("mmove");
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
    console.log("mup");
    var drag = document.getElementsByClassName("drag")[0];

    //ムーブベントハンドラの消去
    document.body.removeEventListener("mousemove", mmove, false);
    drag.removeEventListener("mouseup", mup, false);
    document.body.removeEventListener("touchmove", mmove, false);
    drag.removeEventListener("touchend", mup, false);

    for (let j = 0; j < island_rect.length; j++) {
      island[j][0].style.backgroundColor = '#CCCCCC';
    }
    for (let i = 0; i < elements.length;i++){
      var ship_rect = elements[i].getBoundingClientRect();
      if (detectCollision(ship_rect, house_rect)) {
        window.location.href = 'https://cloud-native-dojo.github.io/front-moc-2022/dock/dock.html';
      }else{
        for (let j = 0; j < island_rect.length;j++) {
          if (detectCollision(island_rect[j], ship_rect)) {
            elements[i].style.top = island_rect[j].top + (island_rect[j].bottom - island_rect[j].top) / 4 + "px";
            elements[i].style.left = island_rect[j].left + (island_rect[j].right - island_rect[j].left) / 4 + 20 + "px";
            island[j][0].style.backgroundColor = '#33FF00';
            break;
          }
        }
      }
    }

    //クラス名 .drag も消す
    drag.classList.remove("drag");
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

})()
