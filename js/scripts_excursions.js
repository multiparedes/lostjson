import { dificultyToString } from "./utils.js";

const mapOverlay = document.querySelector(".map-container");
const mapOverlayMessage = document.querySelector(".b-message");
const map = document.querySelector(".mapa");

mapOverlay.addEventListener("click", () => {
  map.style.pointerEvents = "auto"; // activar eventos del ratón para el iframe
  mapOverlayMessage.style.display = "none"; // ocultar el overlay
});

map.addEventListener("mouseleave", () => {
  map.style.pointerEvents = "none"; // desactivar eventos del ratón para el iframe
  mapOverlayMessage.style.display = "block"; // mostrar el overlay
});

async function showExcursio() {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const excursioId = params.get("id");

  let jsonExcursions = await fetch(
    "https://raw.githubusercontent.com/multiparedes/lostjson/Production/json/JSONsExcursions.json"
  )
    .then((response) => response.json())
    .catch((error) => {
      // En caso de error, puedes manejarlo aquí
      console.error(error);
    });

  jsonExcursions = jsonExcursions.itemListElement;
  console.log(jsonExcursions);
  console.log(excursioId);

  //Information about the excursio is fetched
  const excursio = jsonExcursions.find((exc) => exc.identifier == excursioId);
  const infoExtra = await fetch(excursio.sameAs)
    .then((response) => response.json())
    .catch((error) => {
      // En caso de error, puedes manejarlo aquí
      console.error(error);
    });

  //Title
  let node = document.getElementById("excursioTitle");
  node.innerHTML = excursio.name;

  //Start
  node = document.getElementById("start");
  node.innerHTML = excursio.itinerary[0].name;

  //Description
  node = document.getElementById("description");
  node.innerHTML = excursio.description;

  //Dificulty
  node = document.getElementById("dificulty");
  node.innerHTML = dificultyToString(infoExtra.Dificultat);

  //Type
  node = document.getElementById("type1");
  node.innerHTML = infoExtra.Tipus_de_ruta;

  node = document.getElementById("type2");
  node.innerHTML = infoExtra.Tipus_de_ruta;

  //Height max
  node = document.getElementById("max_height");
  node.innerHTML = `${infoExtra.Altura_maxima}m`;

  //Height min
  node = document.getElementById("min_height");
  node.innerHTML = `${infoExtra.Altura_minima}m`;
  //Desnivell 
  node = document.getElementById("unevenness");
  node.innerHTML = `${infoExtra.Desnivell}m`;
  //Distance 
  node = document.getElementById("distance");
  node.innerHTML = `${infoExtra.Distancia}km` ;
  //Duration 
  node = document.getElementById("duration");
  node.innerHTML = infoExtra.Duracio_total;
  //Season
  node = document.getElementById("season");
  node.innerHTML = infoExtra.Epoca_recomanada;
}
showExcursio();
