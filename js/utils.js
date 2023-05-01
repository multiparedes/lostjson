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
    const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const excursioId = params.get("id");

  let jsonExcursions = await fetch(
    '../json/JSONsExcursions.json'
  )
    .then((response) => response.json())
    .catch((error) => {
      // En caso de error, puedes manejarlo aquí
      console.error(error);
    });

  jsonExcursions = jsonExcursions.itemListElement;

  //Information about the excursio is fetched
  const excursio = jsonExcursions.find((exc) => exc.identifier == excursioId);
  const infoExtra = await fetch(excursio.sameAs)
    .then((response) => response.json())
    .catch((error) => {
      // En caso de error, puedes manejarlo aquí
      console.error(error);
    });
    return {
      excursio,
      infoExtra
    }
  }
