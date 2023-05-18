 export function dificultyToString(value) {
    switch (value) {
      case 0:
        return "Molt Fàcil";
      case 1:
        return "Fàcil";
      case 2:
        return "Mitjà";
      case 3:
        return "Díficil";
      case 4:
        return "Avançat";
      case 5:
        return "Expert";
    }
  }

  export function toStars(int) {
    var enteras = "";
  
    for (var i = 0; i < Math.floor(int); i++) {
      enteras = enteras.concat('<div class="bi-star-fill"></div>\n');
    }
    
    if (int % 1 >= 0.5) {
      enteras = enteras.concat('<div class="bi-star-fill"></div>\n');
    } 
  
    return enteras;
  }

  export function durationToMin(duration) {
    // Separar el string en dos partes: horas y minutos
    const partes = duration.split(" ");
    const horas = parseInt(partes[0]);
    const minutos = parseInt(partes[1]);
  
    // Convertir las horas y los minutos a minutos y sumarlos
    const tiempoEnMinutos = horas * 60 + minutos;
    return tiempoEnMinutos;
  }

  export async function getExcursio(){
    //Excursio id is gotten with the url
    const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const excursioId = params.get("id");

  let jsonExcursions = await fetch(
    '../json/JSONsExcursions.json'
  )
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    });

  jsonExcursions = jsonExcursions.itemListElement;

  //Information about the excursio is fetched
  const excursio = jsonExcursions.find((exc) => exc.identifier == excursioId);
  const infoExtra = await fetch(excursio.sameAs)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    });
    return {
      excursio,
      infoExtra
    }
  }

  export function checkCoordinatesWithinRadius({lat1, lon1, lat2, lon2}) {
    const earthRadius = 6371; // Radio de la Tierra en kilómetros
  
    // Convertir las coordenadas de grados a radianes
    const lat1Rad = toRadians(lat1);
    const lon1Rad = toRadians(lon1);
    const lat2Rad = toRadians(lat2);
    const lon2Rad = toRadians(lon2);
  
    // Calcular la diferencia de latitud y longitud
    const latDiff = lat2Rad - lat1Rad;
    const lonDiff = lon2Rad - lon1Rad;
  
    // Aplicar la fórmula del haversine
    const a =
      Math.sin(latDiff / 2) ** 2 +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(lonDiff / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
  
    // Verificar si la distancia es menor o igual a 15 km
    if (distance <= 15) {
      return true;
    } else {
      return false;
    }
  }
  
  // Función auxiliar para convertir grados a radianes
  function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }