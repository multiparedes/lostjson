import { dificultyToString, getExcursio } from "./utils.js";

const mapOverlay = document.querySelector(".map-container");
const mapOverlayMessage = document.querySelector(".b-container");
const map = document.querySelector(".mapa");

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
  fillExcursio(excursio,infoExtra);

// Videos
  var apiKey = "AIzaSyBNzTRgAIH_1V-eYFol5ByUxgW5cdOSG0A";

 
  let videoName = excursio.name.split(",")[0]
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
        var videoPlayer = document.getElementById('video');
        videoPlayer.src = `https://www.youtube.com/embed/${videoUrl}`;
      },
      function (reason) {
        console.log("Error: " + reason.result.error.message);
      }
      );
    });

  //Weather
  const weatherApiKey = "f6cb10fa96624400aee1b519f5b3f2ad";
    console.log(infoExtra.lon)
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
   temp_min:weatherResponse.main.temp_min,
   weather_icon:weatherResponse.weather[0].icon,
   weather_description: weatherResponse.weather[0].description,
  }



  document.getElementById("weather_desc").innerHTML = capitalizeFirstLetter(weatherInfo.weather_description)
  document.getElementById("weather_icon").src = "https://openweathermap.org/img/wn/" + weatherInfo.weather_icon + "@2x.png"
  document.getElementById("temp_normal").innerHTML = weatherInfo.temp
  document.getElementById("temp_max").innerHTML = weatherInfo.temp_max
  document.getElementById("temp_min").innerHTML = weatherInfo.temp_min
}

async function fillExcursio(excursio, infoExtra){
  //Title
  document.getElementById("excursioTitle").innerHTML = excursio.name;
  

  //Start
  document.getElementById("start").innerHTML = excursio.itinerary[0].name;

  //Description
  document.getElementById("description").innerHTML = excursio.description;

  //Dificulty
  document.getElementById("dificulty").innerHTML = dificultyToString(infoExtra.Dificultat);

  //Type
  document.getElementById("type1").innerHTML = infoExtra.Tipus_de_ruta;
  document.getElementById("type2").innerHTML = infoExtra.Tipus_de_ruta;
  
  //Height max
  document.getElementById("max_height").innerHTML = `${infoExtra.Altura_maxima}m`;
  

  //Height min
  document.getElementById("min_height").innerHTML = `${infoExtra.Altura_minima}m`;
  
  //Desnivell
  document.getElementById("unevenness").innerHTML = `${infoExtra.Desnivell}m`;
  
  //Distance
  document.getElementById("distance").innerHTML = `${infoExtra.Distancia}km`;;
  
  //Duration
  document.getElementById("duration").innerHTML = infoExtra.Duracio_total;;
  
  //Season
  document.getElementById("season").innerHTML = infoExtra.Epoca_recomanada;;
  

  //Audio

  let node = document.getElementById("audio");
  

  await fetch('./audio/Hiking Sounds.mp3')
  .then(response => response.blob()) // convierte la respuesta en un objeto de datos de archivo
  .then(blob => {
    const url = URL.createObjectURL(blob); // crea una URL temporal para el archivo
    const audio = new Audio(url); // crea un objeto de audio con la URL
    
   node.innerHTML = `<audio controls="controls">
   <source src="./audio/Hiking Sounds.mp3" type="audio/wav" />
   <source src="./audio/Hiking Sounds.mp3" type="audio/ogg" />
   <source src="./audio/Hiking Sounds.mp3" type="audio/mpeg" />
  </audio>`;

  })
  .catch(error => {
    console.error('Error al obtener el archivo de audio:', error);
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
showExcursio();
