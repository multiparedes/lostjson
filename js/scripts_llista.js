/*!
 * Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
 */
// This file is intentionally blank
// Use this file to add JavaScript to your project

import { durationToMin, toStars, dificultyToString } from './utils.js';

function cardViewer() {
  //Checks if a search by name has been made
  const input = document.getElementById("cercador");
  input.addEventListener("keypress", () => {
    generateCard({ name: input.value });
  });

  //Checks if a sort has been made
  const selector = document.getElementById("ordenarPor");
  let opcionSeleccionada = selector.selectedIndex;
  generateCard({ sortValue: 0 });

  //Depending on the sort criterium a diferent parametre is passed
  selector.addEventListener("change", () => {
    opcionSeleccionada = selector.selectedIndex;
    switch (opcionSeleccionada) {
      case 1:
        generateCard({ sortValue: 1 });
        break;
      case 2:
        generateCard({ sortValue: 2 });
        break;
      case 3:
        generateCard({ sortValue: 3 });
        break;
    }
  });
}

function loadJSON_LD(info) {
  const script = document.createElement('script');
  script.setAttribute('type', 'application/ld+json');

  let s = {
      "@context": "https://schema.org",
      "@type": "Trip",
      "name": info.name
  };
  script.textContent = JSON.stringify(s);
  document.head.appendChild(script);
}

async function generateCard({ sortValue, name }) {
  
  const toGen = document.getElementById("toGenerar");

  //Get the info of the excursions
  let jsonExcursions = await fetch(
    "../json/JSONsExcursions.json"
  )
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    });

  jsonExcursions = jsonExcursions.itemListElement;
  

  //Get the extra info
  let infoExtras = [];
  await Promise.all(
    jsonExcursions.map(async (excursio) => {
      await fetch(excursio.sameAs)
        .then((response) => response.json())
        .then((data) => {
          infoExtras = [...infoExtras, data];
        });
    })
  );

  //Encapsulate the info into an object 
  let excursions = [];
  excursions = jsonExcursions.map((excursio, index) => {
    return {
      info: excursio,
      extra: infoExtras[index],
    };
  });
  //if search was made
  if (name) {
    excursions = excursions.filter(excursio => excursio.info.name.toLowerCase().trim().includes(name.toLowerCase().trim()));
  }

  //If sort was made
  switch (sortValue) {
    case 1: //By dificulty
      excursions.sort(function (a, b) {
        return a.extra.Dificultat - b.extra.Dificultat;
      });
      break;
    case 2: // By distance
      excursions.sort(function (a, b) {
        return a.extra.Distancia - b.extra.Distancia;
      });
      break;
    case 3: // By duration
      excursions.sort(function (a, b) {
        return (
          durationToMin(a.extra.Duracio_total) -
          durationToMin(b.extra.Duracio_total)
        );
      });
      break;
  }

  let cards = "";
  excursions.forEach((elem) => {
    loadJSON_LD(elem.info);
    cards = cards.concat(
      createCard({
        id: elem.info.identifier,
        nom: elem.info.name,
        dificultatString: dificultyToString(elem.extra.Dificultat),
        dificultatStars: elem.extra.Dificultat,
        distancia: elem.extra.Distancia,
        desnivel: elem.extra.Desnivell,
        duration: elem.extra.Duracio_total,
        urlFoto: elem.info.image[0],
      })
    );
  });

  toGen.innerHTML = cards;
}

function createCard(card) {
  return `
        <div class="col mb-5">
            <div class="card h-100">
                <img class="card-img-top no-active" src="${card.urlFoto}" style="height: 180px;"alt="${card.nom}" />
                <div class="card-body p-4">
                    <div class="text-center">
                        <h5 class="fw-bolder">${card.nom}</h5>
                        <div class="d-flex justify-content-center small text-warning mb-2">
                        ${toStars(
                          card.dificultatStars
                        )}  <span class="text-muted">(${
    card.dificultatStars
  })<span>
                        </div>

                        <div class="d-flex flex-column small">
                            <div>${card.dificultatString}</div>
                            <div>${card.distancia} km</div>
                            <div>Desnivel: ${card.desnivel} m</div>  
                            <div>Duracio: ${card.duration} </div>    
                        </div>
                    </div>
                </div>
                <!-- Product actions-->
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="excursio.html?id=${
                      card.id
                    }">Hike it!</a></div>
                </div>
            </div>
        </div>
        `;
}

cardViewer();
