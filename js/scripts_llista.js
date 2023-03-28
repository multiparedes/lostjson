/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

function generateCard() {
    const toGen = document.getElementById("toGenerar")

    for(var i = 0; i < 100; i++) {
        toGen.innerHTML = toGen.innerHTML.concat(createCard({
            nom: "Teix",
            dificultatString: "Facil",
            dificultatStars: toStars(3.25),
            distancia: "12",
            desnivel: "400",
            urlFoto: "/assets/img/teix.jpg"
        }))
    }
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
                            ${card.dificultatStars}
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
                    <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="#">Hike it!</a></div>
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