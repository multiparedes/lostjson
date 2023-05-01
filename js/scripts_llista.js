/*!
 * Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
 */
// This file is intentionally blank
// Use this file to add JavaScript to your project

import { durationToMin, toStars, dificultyToString } from './utils.js';

function cardViewer() {
  const selector = document.getElementById("ordenarPor");
  let opcionSeleccionada = selector.selectedIndex;
  generateCard({ sortValue: 0 });

  const input = document.getElementById("cercador");
  input.addEventListener("change", () => {
    generateCard({ name: input.value });
  });

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

async function generateCard({ sortValue, name }) {
  const toGen = document.getElementById("toGenerar");

  let jsonExcursions = await fetch(
    "../json/JSONsExcursions.json"
  )
    .then((response) => response.json())
    .catch((error) => {
      // En caso de error, puedes manejarlo aquí
      console.error(error);
    });

  jsonExcursions = jsonExcursions.itemListElement;

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

  let excursions = [];
  excursions = jsonExcursions.map((excursio, index) => {
    return {
      info: excursio,
      extra: infoExtras[index],
    };
  });
  //if search was made
  if (name) {
    // TODO
  }

  //If sort was made
  switch (sortValue) {
    case 1:
      excursions.sort(function (a, b) {
        return a.extra.Dificultat - b.extra.Dificultat;
      });
      break;
    case 2:
      excursions.sort(function (a, b) {
        return a.extra.Distancia - b.extra.Distancia;
      });
      break;
    case 3:
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
                <img class="card-img-top no-active" src="${card.urlFoto}" alt=${card.nom} />
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
