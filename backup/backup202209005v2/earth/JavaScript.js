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
          ship.innerHTML = "<div style='background:" + bgcode + ";width:120px;height:140px;'><img src=\"https://cdn-icons-png.flaticon.com/512/870/870056.png\" width=\"100\" height=\"100\"><p style='color:" + text_color + ";font-weight: bold;margin-top: -25px;'>" + pods[i] + "</p><p style='color:" + text_color + ";font-weight: bold;margin-top: -25px;animation: blinkEffect 1s ease infinite; visibility: hidden;' id='loading_" + pods[i] + "'>loading</p><div>";
        }
        else {
          ship.innerHTML = "<div style='background:" + bgcode + ";width:120px;height:140px;'><img src=\"https://cdn-icons-png.flaticon.com/512/870/870056.png\" width=\"100\" height=\"100\" style='filter: invert(100%);'><p style='color:" + text_color + ";font-weight: bold;margin-top: -25px;'>" + pods[i] + "</p><p style='color:" + text_color + ";font-weight: bold;margin-top: -25px;animation: blinkEffect 1s ease infinite; visibility: hidden;' id='loading_" + pods[i] + "'>loading</p><div>";
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
          target.style.visibility = "visible";
        } else {
          target.style.visibility = "hidden";
          console.log("ship ready:", ship_id);
        }
      }
    } else {
      alert("HTTP-Error: " + response.status);
    }
  }


function check_island() {
  for (let j = 0; j < island_rect.length; j++) {

    island[j][0].classList.remove("bind");
  }

  for (let j = 0; j < island_rect.length; j++) {
    for (let i = 0; i < elements.length; i++) {
      var delete_box = document.getElementsByClassName("delete_ship")[0].getBoundingClientRect();
      console.log("delete_box top:",delete_box.top, "left:", delete_box.left, "bottom:", delete_box.bottom, "right:",delete_box.right);
      console.log("ship top:", ship_rect[i].top, "left:", ship_rect[i].left, "bottom:", ship_rect[i].bottom, "right:", ship_rect[i].right);
      if (detectCollision(delete_box, ship_rect[i])) {
        console.log(elements[i].id);
        deleteShip(elements[i].id);
        elements[i].remove();
      }
      if (detectCollision(ship_box, ship_rect[i]) == false
        && detectCollision(island_rect[j], ship_rect[i])
        && island[j][0].classList.contains("bind") == false
        && window.getComputedStyle(island[j][0]).visibility == "visible") {
        if (j == 0) {
          elements[i].style.top = 160 + "px";
          elements[i].style.left = 270 + "px";
        }
        if (j == 1) {
          elements[i].style.top = 610 + "px";
          elements[i].style.left = 550 + "px";
        }
        if (j == 2) {
          elements[i].style.top = 610 + "px";
          elements[i].style.left = 300 + "px";
        }
        if (j == 3) {
          elements[i].style.top = 160 + "px";
          elements[i].style.left = 600 + "px";
        }
        island[j][0].style.backgroundColor = '#red';

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
        break;
      } else {
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
