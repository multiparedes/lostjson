import { dificultyToString } from './utils.js';

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
  const title = document.getElementById("excursioTitle");
  title.innerHTML = excursio.name;

  //Start
  const start = document.getElementById("start");
  start.innerHTML = excursio.itinerary[0].name;

  //Description
  const description = document.getElementById("description");
  description.innerHTML = excursio.description;

  //Dificulty
  const dificulty = document.getElementById("dificulty");
  dificulty.innerHTML = dificultyToString(infoExtra.Dificultat);

  //Dificulty
  let type = document.getElementById("type1");
  type.innerHTML = infoExtra.Tipus_de_ruta;

  type = document.getElementById("type2");
  type.innerHTML = infoExtra.Tipus_de_ruta;



  
    
}
showExcursio();
