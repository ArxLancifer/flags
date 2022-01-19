let counter = 0;
let valid_neighbours = [];
let my_country_url = `https://restcountries.eu/rest/v2/alpha/${allCountries[0].code}`;
let neighboursArray = [];
let code2Neighbours = [];
let score = 0;
let round = 1;
let fails = 0;
let success = 0;
const my_score = document
  .querySelectorAll("#score")[0]
  .getElementsByTagName("h4")[3];
my_score.textContent = score;
const my_rounds = document
  .querySelectorAll("#score")[0]
  .getElementsByTagName("h4")[2];
my_rounds.textContent = round;
const next_round_panel = document.querySelector("#next-round-panel");
const _warning = document.querySelector(".warning");

//Set 1st country flag
function my_country_flag() {
  let First_flag = document.createElement("span");
  let First_flag_name = document.createElement("p");
  const flag = document.querySelector("#my-country-flag");
  flag.appendChild(First_flag);
  flag.appendChild(First_flag_name);

  flag.querySelectorAll("span")[0].textContent = `${country2emoji2(
    allCountries[0].code
  )}`;
  flag.querySelectorAll("p")[0].textContent = `${allCountries[0].name}`;
  flag.querySelectorAll("span")[0].id = "my-country";
  flag.querySelectorAll("p")[0].id = "my-country-name";
}
//ProgressBar

const progress_bar = document
  .getElementById("progress")
  .querySelectorAll("div");
document.addEventListener("click", () => {
  //counter++;
  let size = (success / valid_neighbours.length) * 100;
  if (counter <= valid_neighbours.length) {
    progress_bar[0].setAttribute("style", "display:block");
    progress_bar[0].style.width = `${size}%`;
  }
});

//Fetching borders
function fetch_borders() {
  console.log("fetching");
  fetch(my_country_url)
    .then((my_neighbours) => {
      if (my_neighbours.status === 200) {
        return my_neighbours.json();
      } else throw new Error(my_neighbours.status);
    })
    .then((my_neighbours_pusher) => {
      my_neighbours_pusher.borders.forEach((border) => {
        for (let i = 0; i < countryObjects.length; i++) {
          if (border === countryObjects[i].code3) {
            code2Neighbours.push(countryObjects[i].code);
            valid_neighbours.push(countryObjects[i].code);
          }
        }
      });

      Neighbours_flags();
    })
    .then(() => {
      if (code2Neighbours == 0) {
        BoardClear();
      }
    });
}
//Search_name
function search_name(name) {
  for (let i = 0; i < countryObjects.length; i++) {
    if (name === countryObjects[i].code) return countryObjects[i].name;
  }
}
//Neighbours-table
const neighbours_panel = document.querySelector("#neighbours-panel");
function Neighbours_flags() {
  code2Neighbours.forEach((neigh) => {
    code2Neighbours.push(allCountries[Math.floor(Math.random() * 251)].code);
  });
  shuffleArray(code2Neighbours);
  code2Neighbours.forEach((flag_code) => {
    let neightbour_div = document.createElement("div");
    neightbour_div.classList.add("_flag");
    let neighbour_flag = document.createElement("span");
    let neighbour_name = document.createElement("p");
    neighbour_name.textContent = `${search_name(flag_code)}`;
    neighbour_flag.textContent = `${country2emoji2(flag_code)}`;
    neighbours_panel.appendChild(neightbour_div);
    neightbour_div.appendChild(neighbour_flag);
    neightbour_div.appendChild(neighbour_name);
    if (valid_neighbours.includes(flag_code)) {
      neightbour_div.addEventListener("click", function _listener() {
        neightbour_div.classList.add("was-clicked", "neighbour-is-valid");
        score += 5;
        my_score.textContent = score;
        counter++;
        success++;
        console.log("success", success);
        if (success >= valid_neighbours.length) {
          next_round_panel.style.visibility = "visible";
          _warning.textContent = "Τους βρήκατε όλους!";
          document.querySelector("#btn-next-round").disabled = false;
          console.log("if statement success");
        }
        neightbour_div.removeEventListener("click", _listener);
      });
    } else {
      neightbour_div.addEventListener("click", function _listener() {
        neightbour_div.classList.add("was-clicked", "neighbour-is-invalid");
        score -= 3;
        my_score.textContent = score;
        fails++;
        console.log("fails", fails);
        if (fails >= valid_neighbours.length) {
          next_round_panel.style.visibility = "visible";
          _warning.textContent = "Κρίμα, χάσατε!";
          document.querySelector("#btn-next-round").disabled = false;
          console.log("if statement fails");
        }
        neightbour_div.removeEventListener("click", _listener);
      });
    }
  });
}

function BoardClear() {
  neighbours_panel
    .querySelectorAll("._flag")
    .forEach((_node) => _node.remove());
  code2Neighbours = [];
  console.log(code2Neighbours);
  allCountries = shuffleArray(countryObjects);
  my_country_url = `https://restcountries.eu/rest/v2/alpha/${allCountries[0].code}`;
  my_country_flag();
  fetch_borders();
}

const warning = document.getElementsByTagName("section")[0];
//function my_buttons (){
document.querySelector("#btn-new-game").addEventListener("click", () => {
  warning.style.display = "block";
  next_round_panel.style.visibility = "hidden";
});
document.querySelector(".ok").addEventListener("click", () => {
  warning.style.display = "none";
  console.log("OK pressed");
  BoardClear();
  valid_neighbours = [];
  my_score.textContent = 0;
  fails = 0;
  success = 0;
  counter = 0;
  round = 1;
  score = 0;
  my_rounds.textContent = round;
});
document.querySelector(".cancel").addEventListener("click", () => {
  warning.style.display = "none";
  console.log("CANCEL pressed");
});

function win_lose() {
  if (fails >= valid_neighbours.length) {
    document.querySelector("#next-round-panel").style.display = "block";
    document.querySelector(".warning").textContent = "Κρίμα, χάσατε!";
    counter = 0;
  } else if (counter >= valid_neighbours.length) {
    document.querySelector("#next-round-panel").style.display = "block";
    document.querySelector(".warning").textContent = "Τους βρήκατε όλους!";
    counter = 0;
  }
}

document.querySelector("#btn-next-round").addEventListener("click", () => {
  document.querySelector("#btn-next-round").disabled = true;
  next_round_panel.style.visibility = "hidden";
  fails = 0;
  success = 0;
  counter = 0;
  round++;
  my_rounds.textContent = round;
  valid_neighbours = [];
  BoardClear();
});

//Το παρακάτω αφορά μόνο τους χρήστες macOS.
if (navigator.appVersion.indexOf("Macintosh") > 0) {
  document.body.style.fontFamily = '"Open Sans"';
}
