/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

async function generateCard() {
    const toGen = document.getElementById("toGenerar")

    var jsonExcursions = "d";
   await fetch('../json/JSONsExcursions.json')
  .then(response => response.json())
  .then(data => {
    // Aquí puedes trabajar con los datos en formato JSON convertidos a objeto JavaScript
    jsonExcursions = data.itemListElement;
  })
  .catch(error => {
    // En caso de error, puedes manejarlo aquí
    console.error(error);
  });
  
  var jsonExcursions;
  await fetch('../json/JSONsExcursions.json')
  .then(response => response.json())
  .then(data => {
      // Aquí puedes trabajar con los datos en formato JSON convertidos a objeto JavaScript
      jsonExcursions = data.itemListElement;
    })
    .catch(error => {
        // En caso de error, puedes manejarlo aquí
        console.error(error);
    });
    var urlsExtras = [];
    for (let i = 0; i < jsonExcursions.length-1; i++) {
        urlsExtras = [...urlsExtras, `../json/informacioExtra${i}.json`];
      }
    

      let infoExtras = [];
    const posts = await Promise.all(
        urlsExtras.map(async (extra) => {
           // console.log(extra)
          return await fetch(extra)
         .then(response => response.json())
         .then(data => {
            // Aquí puedes trabajar con los datos en formato JSON convertidos a objeto JavaScript
            infoExtras.push(data);
           
          });
          
      })

      )
    //  let infoExtras = posts.map(response =>  response.json());

    
    jsonExcursions.forEach((elem,index) => {
        console.log(jsonExcursions)
        toGen.innerHTML = toGen.innerHTML.concat(createCard({
            nom: elem.name,
            dificultatString: "Dificultat",
            dificultatStars: infoExtras[index].Dificultat,
            distancia: infoExtras[index].Distancia,
            desnivel: infoExtras[index].Desnivell,
            urlFoto: "/assets/img/teix.jpg"
        }))
    });
   
    

}

function toStars(int) {
    var enteras = ""

    for(var i = 0; i < Math.floor(int); i++) {
        enteras = enteras.concat('<div class="bi-star-fill"></div>\n')
    }

    if((int % 1) <= 0.5) {
        enteras = enteras.concat('<div class="bi-star-half"></div>\n')
    } else {
        enteras = enteras.concat('<div class="bi-star-fill"></div>\n')
    }

    console.log(enteras % 1)

    return enteras
}


function createCard(card) {
    return `
        <div class="col mb-5">
            <div class="card h-100">
                <img class="card-img-top no-active" src="${card.urlFoto}" alt="Puig des Teix - Cim" />
                <div class="card-body p-4">
                    <div class="text-center">
                        <h5 class="fw-bolder">${card.nom}</h5>
                        <div class="d-flex justify-content-center small text-warning mb-2">
                        ${toStars(card.dificultatStars)}  <span class="text-muted">(${card.dificultatStars})<span>
                        </div>

                        <div class="d-flex flex-column small">
                            <div>${card.dificultatString}</div>
                            <div>${card.distancia}km</div>
                            <div>Desnivel: ${card.desnivel}m</div>   
                        </div>
                    </div>
                </div>
                <!-- Product actions-->
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="excursio.html?id=1">Hike it!</a></div>
                </div>
            </div>
        </div>
        `;
    
}

var card = {
    nom: "",
    dificultatString: "",
    dificultatStars: "",
    distancia: "",
    desnivel: "",
    urlFoto: ""
}

generateCard()