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
    if (int === 0) {
      return enteras;
    } else if (int % 1 <= 0.5) {
      enteras = enteras.concat('<div class="bi-star-half"></div>\n');
    } else {
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
