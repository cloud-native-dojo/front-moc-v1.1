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

        console.log("background color:", bgcode);

        // ?????????????????????R/G/B?????????????????????
        const red = parseInt(bgcode.substr(1, 2), 16);
        const green = parseInt(bgcode.substr(3, 2), 16);
        const blue = parseInt(bgcode.substr(5, 2), 16);

        // ??????????????????(0???255)
        const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
        // ??????????????????(0???100)
        const luminance = brightness / 2.55

        // ?????????(50)?????????????????????????????????????????????????????????????????????
        let text_color = luminance > 50 ? "#000000" : "#ffffff";
        console.log("text color:", text_color);
        if (luminance > 50) {

          ship.innerHTML = "<div style='width:120px;height:140px;'><img src=\"./img/browser.svg\" width=\"30\" height=\"30\"><svg id=\"ship_1\" width=\"107\" height=\"110\" viewBox=\"0, 0, 900, 960\" xmlns=\"http://www.w3.org/2000/svg\"> \
          <path stroke=\"black\" stroke-width=\"2\" fill=\"white\" d=\"M 60 0 L  60 20 90 20 C 90 20 70 40 90 60 L 30 60 C 30 60 10 40 30 20 L 60 20 M 60 60 L 60 70 \"/>\
          <path stroke=\"black\" stroke-width=\"2\" fill=\""+ bgcode + "\" d=\"M 20 70  L 100 70 C 110 70 63 130 20 70\"/>\
          <path stroke=\"#4169E1\" stroke-width=\"7\" fill=\"#4169E1\" d=\"M 19 97 C 19 97 26 102 29 97 C 29 97 34 90 39 97 C 39 97 44 104 49 97 C 50 97 55 90  61 97 \"/>\
          <path stroke=\"#4169E1\" stroke-width=\"7\" fill=\"#4169E1\" d=\"M 60 96 C 60 96 67 101 70 96 C 70 96 75 89 80 96 C 80 96 85 103 90 96 C 90 96 95 89 100 96 \"/>\</svg>\
          <p id = \"loading_" + ship.id + "\">loading<p></div>";

        }
        else {

          ship.innerHTML = "<div style='width:120px;height:140px;'><img src=\"./img/browser.svg\" width=\"130\" height=\"30\"><svg id=\"ship_1\" width=\"107\" height=\"110\" viewBox=\"0, 0, 107, 110\" xmlns=\"http://www.w3.org/2000/svg\"> \
          <path stroke=\"black\" stroke-width=\"2\" fill=\"white\" d=\"M 60 0 L  60 20 90 20 C 90 20 70 40 90 60 L 30 60 C 30 60 10 40 30 20 L 60 20 M 60 60 L 60 70 \"/>\
          <path stroke=\"black\" stroke-width=\"2\" fill=\"" + bgcode + "\" d=\"M 20 70  L 100 70 C 110 70 63 130 20 70\"/>\
          <path stroke=\"#4169E1\" stroke-width=\"7\" fill=\"#4169E1\" d=\"M 19 97 C 19 97 26 102 29 97 C 29 97 34 90 39 97 C 39 97 44 104 49 97 C 50 97 55 90  61 97 \"/>\
          <path stroke=\"#4169E1\" stroke-width=\"7\" fill=\"#4169E1\" d=\"M 60 96 C 60 96 67 101 70 96 C 70 96 75 89 80 96 C 80 96 85 103 90 96 C 90 96 95 89 100 96 \"/>\</svg>\
          <p id=\"loading_" + ship.id + "\">loading<p></div>";

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
    console.log("fetched ports:", ports);
    for (var i = 0; i < all_ports.length; i++) {
      all_ports[i].innerText = "port:" + ports[i];
    }
  } else {
    alert("HTTP-Error: " + response.status);
  }

  let get_save = await fetch("http://10.204.227.162:8000/save/");

  if (get_save.ok) {
    let save_data = (await get_save.json()).data;
    console.log("save data:", save_data);
    for (let i = 0; i < island.length; i++) {
      island[i][0].style.visibility = save_data.island[i];
      all_ports[i].style.visibility = save_data.island[i];
      //all_dock[i].style.visibility = save_data.island[i];
    }
    for (let i = 0; i < elements.length; i++) {
      try {
        const element_id = elements[i].id;
        console.log("ship top position:", save_data.ship[element_id].split(" ")[0]);
        elements[i].style.top = save_data.ship[element_id].split(" ")[0];
        elements[i].style.left = save_data.ship[element_id].split(" ")[1];
      } catch (e) { }
      ship_rect[i] = elements[i].getBoundingClientRect();
    }
  } else {
    alert("HTTP-Error: " + response.status);
  }
  check_status();
  check_island();
  save();
  //?????????????????????????????????????????????????????????????????????????????????????????????
  var x;
  var y;

  //?????????????????????????????????????????????????????????????????????????????????
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("mousedown", mdown, false);
    elements[i].addEventListener("touchstart", mdown, false);
  }

  //????????????????????????????????????
  function mdown(e) {

    //??????????????? .drag ?????????
    this.classList.add("drag");

    //?????????????????????????????????????????????????????????????????????
    if (e.type === "mousedown") {
      var event = e;
    } else {
      var event = e.changedTouches[0];
    }

    //?????????????????????????????????
    x = event.pageX - this.offsetLeft;
    y = event.pageY - this.offsetTop;

    //??????????????????????????????????????????
    document.body.addEventListener("mousemove", mmove, false);
    document.body.addEventListener("touchmove", mmove, false);
  }

  //????????????????????????????????????????????????
  function mmove(e) {
    //???????????????????????????????????????
    var drag = document.getElementsByClassName("drag")[0];

    //????????????????????????????????????????????????
    if (e.type === "mousemove") {
      var event = e;
    } else {
      var event = e.changedTouches[0];
    }

    //??????????????????????????????????????????????????????????????????????????????????????????
    e.preventDefault();

    //????????????????????????????????????????????????
    drag.style.top = event.pageY - y + "px";
    drag.style.left = event.pageX - x + "px";

    //???????????????????????????????????????????????????????????????????????????????????????
    drag.addEventListener("mouseup", mup, false);
    document.body.addEventListener("mouseleave", mup, false);
    drag.addEventListener("touchend", mup, false);
    document.body.addEventListener("touchleave", mup, false);

  }

  //??????????????????????????????????????????
  function mup(e) {
    console.log("called: mup()");

    try {
      var drag = document.getElementsByClassName("drag")[0];
    } catch (e) { }

    //???????????????????????????????????????
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

    //???????????? .drag ?????????
    try {
      drag.classList.remove("drag");
    } catch (e) { }
  }
  setInterval(check_status, 3000);

})()

async function check_status() {
  console.log("called: check_status()");

  let result = await fetch("http://10.204.227.162:8000/pods/status/");
  if (result.ok) {
    let status_data = (await result.json()).data;
    for (let i = 0; i < status_data.length; i++) {
      const ship_id = elements[i].id;
      const ship_status = status_data[i];
      try {
        console.log("ship status:", ship_id, ship_status);
      } catch (e) {
        continue;
      }

      const target = document.getElementById("loading_" + ship_id)
      if (ship_status == false) {
        target.innerHTML = "Loading";
      } else {
        console.log("ship ready:", ship_id);
        await fetch("http://10.204.227.162:8000/" + ship_id + "/pass")
          .then((response) => response.json())
          .then((data) => target.innerHTML = "pass: " + data.pass);
      }
    }
  } else {
    alert("HTTP-Error: " + response.status);
  }
}


function check_island() {

  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.remove("bind");
  }
  document.getElementsByClassName("island_body")[0].style.fill = "#CCCCCC";
  document.getElementsByClassName("island_body")[1].style.fill = "#CCCCCC";
  document.getElementsByClassName("island_body")[2].style.fill = "#CCCCCC";
  document.getElementsByClassName("island_body")[3].style.fill = "#CCCCCC";

  for (let j = 0; j < island_rect.length; j++) {
    for (let i = 0; i < elements.length; i++) {
      var delete_box = document.getElementsByClassName("delete_ship")[0].getBoundingClientRect();
      console.log("delete_box top:", delete_box.top, "left:", delete_box.left, "bottom:", delete_box.bottom, "right:", delete_box.right);
      console.log("ship top:", ship_rect[i].top, "left:", ship_rect[i].left, "bottom:", ship_rect[i].bottom, "right:", ship_rect[i].right);
      if (detectCollision(delete_box, ship_rect[i])) {
        console.log(elements[i].id);
        deleteShip(elements[i].id);
        elements[i].remove();

        const music = new Audio('sound/delete_ship.mp3');
        music.currentTime = 0;
        music.play();
      }
      if (detectCollision(ship_box, ship_rect[i]) == false
        && detectCollision(island_rect[j], ship_rect[i])
        && island[j][0].classList.contains("bind") == false
        && window.getComputedStyle(island[j][0]).visibility == "visible") {
        //???????????????????????????????????????????????????
        const music = new Audio('sound/cracker.mp3');
        if (j == 0) {
          elements[i].style.top = 129 + "px";
          elements[i].style.left = 210 + "px";
          party.confetti(document.getElementsByClassName("island1")[0])
          document.getElementsByClassName("island_body")[0].style.fill = "#7FFF00";
          music.currentTime = 0;
          music.play();
        }
        if (j == 1) {
          elements[i].style.top = 582 + "px";
          elements[i].style.left = 697 + "px";
          party.confetti(document.getElementsByClassName("island2")[0])
          document.getElementsByClassName("island_body")[1].style.fill = "#7FFF00";
          music.currentTime = 0;
          music.play();
        }
        if (j == 2) {
          elements[i].style.top = 581 + "px";
          elements[i].style.left = 212 + "px";
          party.confetti(document.getElementsByClassName("island3")[0])
          document.getElementsByClassName("island_body")[2].style.fill = "#7FFF00";
          music.currentTime = 0;
          music.play();
        }
        if (j == 3) {
          elements[i].style.top = 131 + "px";
          elements[i].style.left = 697 + "px";
          party.confetti(document.getElementsByClassName("island4")[0])
          document.getElementsByClassName("island_body")[3].style.fill = "#7FFF00";
          music.currentTime = 0;
          music.play();
        }

        island[j][0].style.backgroundColor = 'transparent';


        post_data('http://10.204.227.162:8000/services/',
          {
            // "port": all_ports[j].innerText,
            "port": parseInt(all_ports[j].innerText.replace("port:", ""), 10),
            "name": elements[i].id
          }
        )
          .then(data => {
            console.log(data); // `data.json()` ????????????????????????????????? JSON ?????????
          });

        let link = document.getElementById('island' + (j + 1) + '_linkbtn');
        console.log(link)
        let url = 'http://10.204.227.151:' + all_ports[j].innerText;
        link.setAttribute('href', url.replace(":port", ""));
        island[j][0].classList.add("bind");
        elements[i].classList.add("bind");
        break;
      } else {
        /*
        island[j][0].style.backgroundColor = '#CCCCCC';
        island[j][0].style.backgroundColor = '#6699FF';
        */
        island[j][0].style.backgroundColor = 'transparent';
        island[j][0].classList.remove("bind");
      }
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].classList.contains("bind") == false) {
          console.log("send:" + elements[i].id)
          post_data('http://10.204.227.162:8000/services/',
            {
              // "port": all_ports[j].innerText,
              "port": -1,
              "name": elements[i].id
            }
          )
            .then(data => {
              console.log(data); // `data.json()` ????????????????????????????????? JSON ?????????
            });
        }
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
    save_message.ship[elements[i].id] = window.getComputedStyle(elements[i]).top + " " + window.getComputedStyle(elements[i]).left;
  }
  post_data('http://10.204.227.162:8000/save/', save_message
  )
    .then(data => {
      console.log(data.data); // `data.json()` ????????????????????????????????? JSON ?????????
    }
    );

}

//url???????????????????????????
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
  console.log("called: addIsland()");
  island[0][0].classList.toggle('active');
  for (var i = 0; i < island.length; i++) {
    if (window.getComputedStyle(island[i][0]).visibility == "hidden") {
      island[i][0].style.visibility = "visible";
      all_ports[i].style.visibility = "visible";
      all_dock[i].style.visibility = "visible";
      save();
      break;
    }
  }
}

function deleteIsland() {
  console.log("called: deleteIsland()");
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
  console.log("called: deleteShip()");
  delete_data('http://10.204.227.162:8000/pods/',
    {
      "name": ShipName
    })
    .then(data => {
      console.log(data); // `data.json()` ????????????????????????????????? JSON ?????????
    });
}


//????????????????????????????????????

async function post_data(url = '', data = {}) {
  // ?????????????????????????????? * ?????????????????????
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
    body: JSON.stringify(data) // ???????????????????????? "Content-Type" ???????????????????????????????????????????????????
  })
  return response.json(); // JSON ??????????????????????????????????????? JavaScript ???????????????????????????
}

async function delete_data(url = '', data = {}) {
  // ?????????????????????????????? * ?????????????????????
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
    body: JSON.stringify(data) // ???????????????????????? "Content-Type" ???????????????????????????????????????????????????
  })
  return response.json(); // JSON ??????????????????????????????????????? JavaScript ???????????????????????????
}
