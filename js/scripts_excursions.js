import {
  dificultyToString,
  getExcursio,
  checkCoordinatesWithinRadius,
} from "./utils.js";

const mapOverlay = document.querySelector(".map-container");
const mapOverlayMessage = document.querySelector(".b-container");
const map = document.querySelector(".mapa");

document.querySelector("form").addEventListener("submit", updateComments);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

mapOverlay.addEventListener("click", () => {
  map.style.pointerEvents = "auto"; // activar eventos del ratón para el iframe
  mapOverlayMessage.style.display = "none"; // ocultar el overlay
});

map.addEventListener("mouseleave", () => {
  map.style.pointerEvents = "none"; // desactivar eventos del ratón para el iframe
  mapOverlayMessage.style.display = "flex"; // mostrar el overlay
});

async function showExcursio() {
  //Get the info of the excursió
  const { excursio, infoExtra } = await getExcursio();

  //Fill the html template with dynamic info
  fillExcursio(excursio, infoExtra);

  // Videos
  var apiKey = "AIzaSyBNzTRgAIH_1V-eYFol5ByUxgW5cdOSG0A";

  let videoName = excursio.name.split(",")[0];
  gapi.load("client", function () {
    gapi.client
      .init({
        apiKey: apiKey,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
        ],
      })
      .then(function () {
        return gapi.client.youtube.search.list({
          q: `Excursión ${videoName}`,
          type: "video",
          part: "id,snippet",
          maxResults: 1,
        });
      })
      .then(
        function (response) {
          let videoUrl = response.result.items[0].id.videoId;
          var videoPlayer = document.getElementById("video");
          videoPlayer.src = `https://www.youtube.com/embed/${videoUrl}`;
        },
        function (reason) {
          console.log("Error: " + reason.result.error.message);
        }
      );
  });

  //Weather
  const weatherApiKey = "f6cb10fa96624400aee1b519f5b3f2ad";
  let weatherResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${infoExtra.lat}&lon=${infoExtra.lon}&appid=${weatherApiKey}&units=metric&lang=ca`
  )
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    });

  const weatherInfo = {
    temp: weatherResponse.main.temp,
    temp_max: weatherResponse.main.temp_max,
    temp_min: weatherResponse.main.temp_min,
    weather_icon: weatherResponse.weather[0].icon,
    weather_description: weatherResponse.weather[0].description,
  };
  document.getElementById("weather_desc").innerHTML = capitalizeFirstLetter(
    weatherInfo.weather_description
  );
  document.getElementById("weather_icon").src =
    "https://openweathermap.org/img/wn/" + weatherInfo.weather_icon + "@2x.png";
  document.getElementById("temp_normal").innerHTML = weatherInfo.temp;
  document.getElementById("temp_max").innerHTML = weatherInfo.temp_max;
  document.getElementById("temp_min").innerHTML = weatherInfo.temp_min;

  //Other JSONs

  //Mountains
  const mountainsResponse = await fetch(`http://www.joanpep.com/jsons/mountains.json`, { mode: 'no-cors' })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching Mountains:", error);
    });

    console.log(mountainsResponse)

  let mountains = mountainsResponse.itemListElement.reduce(
    (accumulator, mountain) => {
      if (
        checkCoordinatesWithinRadius({
          lat1: infoExtra.lat,
          lon1: infoExtra.lon,
          lat2: mountain.geo.latitude,
          lon2: mountain.geo.longitude,
        })
      ) {
        accumulator.push(mountain);
      }
      return accumulator;
    },
    []
  );
  mountains = mountains.map((mountain) => {
    return { 
      name: mountain.name,
      lat: mountain.geo.latitude,
      lon: mountain.geo.longitude,
      elevation: mountain.geo.elevation,
      review: mountain.review[0].text,
      description: mountain.description,
      img: mountain.image[0].url,
    };
  });

  //Monuments
  const monumentsResponse = await fetch(`json/externs/Monumentos.json`)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching Monuments:", error);
    });

  let monuments = monumentsResponse.itemListElement.reduce(
    (accumulator, monument) => {
      if (
        checkCoordinatesWithinRadius({
          lat1: infoExtra.lat,
          lon1: infoExtra.lon,
          lat2: monument.geo.latitude,
          lon2: monument.geo.longitude,
        })
      ) {
        accumulator.push(monument);
      }
      return accumulator;
    },
    []
  );
  monuments = monuments.map((monument) => {
    return { 
      name: monument.name,
      lat: monument.geo.latitude,
      lon: monument.geo.longitude,
      description: monument.description,
      schedule: monument.openingHours[0],
      img: monument.image[0].url,
      adress: monument.address
    };
  });
  
  console.log(monuments)
}

async function fillExcursio(excursio, infoExtra) {
  const pageContent = document.getElementById("page-content");

  //Title
  //document.getElementById("excursioTitle").innerHTML = excursio.name;

  const title = document.createElement("span");
  title.classList.add("Title");
  title.textContent = excursio.name;
  document.getElementById("excursioTitle").appendChild(title);

  const detailsSection = document.createElement("section");
  detailsSection.setAttribute("aria-labelledby", "details-heading");
  //Start
  //document.getElementById("start").innerHTML = excursio.itinerary[0].name;

  const start = document.createElement("span");
  start.classList.add("Start");
  start.textContent = excursio.itinerary[0].name;
  document.getElementById("start").appendChild(start);

  //Description
  const formatedDesc = excursio.description.split("\n\n");
  formatedDesc.forEach((desc) => {
    const p = document.createElement("p");
    p.textContent = desc;
    document.getElementById("description").appendChild(p);
  });

  //Dificulty
  //document.getElementById("dificulty").innerHTML = dificultyToString(infoExtra.Dificultat);

  const difficultyLevel = document.createElement("span");
  difficultyLevel.classList.add("difficulty-level");
  difficultyLevel.textContent = dificultyToString(infoExtra.Dificultat);
  document.getElementById("dificulty").appendChild(difficultyLevel);

  //Type
  document.getElementById("type1").innerHTML = infoExtra.Tipus_de_ruta;
  document.getElementById("type2").innerHTML = infoExtra.Tipus_de_ruta;

  //Height max
  //document.getElementById("max_height").innerHTML = `${infoExtra.Altura_maxima}m`;

  const maxHeight = document.createElement("span");
  maxHeight.classList.add("max-height");
  maxHeight.textContent = `${infoExtra.Altura_maxima}m`;
  document.getElementById("max_height").appendChild(maxHeight);

  //Height min
  //document.getElementById("min_height").innerHTML = `${infoExtra.Altura_minima}m`;

  const minHeight = document.createElement("span");
  minHeight.classList.add("min-height");
  minHeight.textContent = `${infoExtra.Altura_minima}m`;
  document.getElementById("min_height").appendChild(minHeight);

  //Desnivell
  //document.getElementById("unevenness").innerHTML = `${infoExtra.Desnivell}m`;

  const elevation = document.createElement("span");
  elevation.classList.add("Elevation-gain");
  elevation.textContent = `${infoExtra.Desnivell}m`;
  document.getElementById("unevenness").appendChild(elevation);

  //Distance
  //document.getElementById("distance").innerHTML = `${infoExtra.Distancia}km`;;

  const hikeDistance = document.createElement("span");
  hikeDistance.classList.add("Hike-distance");
  hikeDistance.textContent = `${infoExtra.Distancia}km`;
  document.getElementById("distance").appendChild(hikeDistance);

  //Duration
  // document.getElementById("duration").innerHTML = infoExtra.Duracio_total;;

  const hikeDuration = document.createElement("span");
  hikeDuration.classList.add("Hike-Duration");
  hikeDuration.textContent = infoExtra.Duracio_total;
  document.getElementById("duration").appendChild(hikeDuration);

  //Season
  // document.getElementById("season").innerHTML = infoExtra.Epoca_recomanada;;

  const hikeSeason = document.createElement("span");
  hikeSeason.classList.add("Recommended-Season:");
  hikeSeason.textContent = infoExtra.Epoca_recomanada;
  document.getElementById("season").appendChild(hikeSeason);

  //Audio
  let node = document.getElementById("audio");

  await fetch("./audio/Hiking Sounds.mp3")
    .then((response) => response.blob()) // convierte la respuesta en un objeto de datos de archivo
    .then((blob) => {
      const url = URL.createObjectURL(blob); // crea una URL temporal para el archivo
      const audio = new Audio(url); // crea un objeto de audio con la URL

      node.innerHTML = `<audio controls="controls">
   <source src="./audio/Hiking Sounds.mp3" type="audio/wav" />
   <source src="./audio/Hiking Sounds.mp3" type="audio/ogg" />
   <source src="./audio/Hiking Sounds.mp3" type="audio/mpeg" />
  </audio>`;
    })
    .catch((error) => {
      console.error("Error al obtener el archivo de audio:", error);
    });

  //Images
  let images = "";
  let active = "";
  node = document.getElementById("carouselImagenesGenerate");
  excursio.image.forEach((img, idx) => {
    active = "";
    if (idx == 0) {
      active = " active";
    }
    images = images.concat(`<div class="carousel-item ${active}">
    <img src="${img}" class="d-block w-100" alt="...">
    </div>`);
  });
  node.innerHTML = images;
}

async function loadComments() {
  const commentsSection = document.getElementById("commentsArea");
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const excursioId = params.get("id");

  let comentaris = await getCommentsForPage(excursioId);

  if (comentaris.length !== 0) {
    comentaris.forEach((coment) => {
      const newComment = document.createElement("p");
      const username = document.createElement("span");
      username.textContent = coment.user + ": ";
      username.classList.add("fw-bold"); // Agregamos la clase fw-bold para hacer el nombre de usuario en negrita
      newComment.appendChild(username);
      newComment.appendChild(document.createTextNode(coment.desc));
      commentsSection.appendChild(newComment);
    });
  } else {
    const missingComments = document.createElement("p");
    missingComments.textContent = "Encara no hi ha cap comentari... ";
    commentsSection.appendChild(missingComments);
  }
}

async function getCommentsForPage(pageNumber) {
  let comments = await fetch("./json/comentaris.json")
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    });

  let filteredComments = [];

  for (let i = 0; i < comments.comentaris.length; i++) {
    if (comments.comentaris[i].page === parseInt(pageNumber)) {
      filteredComments.push(comments.comentaris[i]);
    }
  }

  return filteredComments;
}

async function updateComments(event) {
  event.preventDefault();

  const comForm = document.getElementById("commentsForm");
  const comSucess = document.getElementById("formSucces");

  comForm.classList.add("d-none");
  comSucess.classList.remove("d-none");
  comSucess.classList.add("d-block");
}

loadComments();
showExcursio();
