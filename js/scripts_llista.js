/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

function cardViewer(){
    const selector = document.getElementById("ordenarPor")
    let opcionSeleccionada = selector.selectedIndex;
    generateCard({sortValue: 0});

    const input = document.getElementById("cercador")
    input.addEventListener("change",() =>{
        generateCard({name: input.value})
    })
    


    selector.addEventListener("change",() => {
    opcionSeleccionada = selector.selectedIndex;
    switch(opcionSeleccionada){
        case 1:
            generateCard({sortValue: 1});
            break;
        case 2:
            generateCard({sortValue: 2});
            break;
        case 3:
            generateCard({sortValue: 3});
            break;
    }
    })
}

async function generateCard({sortValue, name}) {
    const toGen = document.getElementById("toGenerar")

        var jsonExcursions;
        await fetch('https://raw.githubusercontent.com/multiparedes/lostjson/Production/json/JSONsExcursions.json')
        .then(response => response.json())
        .then(data => {
        // Aquí puedes trabajar con los datos en formato JSON convertidos a objeto JavaScript
        jsonExcursions = data.itemListElement;
        })
        .catch(error => {
        // En caso de error, puedes manejarlo aquí
        console.error(error);
        });   
      let infoExtras = [];
    const posts = await Promise.all(
        jsonExcursions.map(async (excursio) => {
          
          return await fetch(excursio.sameAs)
         .then(response => response.json())
         .then(data => {
            // Aquí puedes trabajar con los datos en formato JSON convertidos a objeto JavaScript
            infoExtras.push(data);
           
          });
          
      })
      )
      
        let excursions = []
        excursions = jsonExcursions.map((excursio,index) =>  {return {
        info: excursio, 
        extra: infoExtras[index]
        }});
        //if search was made
        if(name){

       // TODO

        }

        //If sort was made
        switch(sortValue){
            case 1:
                excursions.sort(function(a, b) {
                    return a.extra.Dificultat - b.extra.Dificultat;
                  });
                break;
            case 2:
                excursions.sort(function(a, b) {
                    return  a.extra.Distancia - b.extra.Distancia ;
                  });
                  break;
            case 3:
                  excursions.sort(function(a, b) {
                    return durationToMin(a.extra.Duracio_total) - durationToMin(b.extra.Duracio_total);
                  });
                break;  
                
        }
       

        
      
        cards = "";
        excursions.forEach((elem) => {
            cards = cards.concat(createCard({
                id: elem.info.identifier,
                nom: elem.info.name,
                dificultatString: dificultyToInt(elem.extra.Dificultat),
                dificultatStars: elem.extra.Dificultat,
                distancia: elem.extra.Distancia,
                desnivel: elem.extra.Desnivell,
                duration: elem.extra.Duracio_total,
                urlFoto: elem.info.image[0]
            }))
        });

        toGen.innerHTML = cards;
   
    

}
function durationToMin(duration){
    // Separar el string en dos partes: horas y minutos
    const partes = duration.split(" ");
    const horas = parseInt(partes[0]);
    const minutos = parseInt(partes[1]);

    // Convertir las horas y los minutos a minutos y sumarlos
    const tiempoEnMinutos = horas * 60 + minutos;
    return tiempoEnMinutos
}

function dificultyToInt(value){
    switch (value) {
        case 0:
            return "Molt Fàcil"
        case 1:
            return "Fàcil"
        case 2:
            return "Mitjà"
        case 3:
            return "Díficil"
        case 4:
            return "Avançat"
        case 5:
            return "Expert"
    }
}

function toStars(int) {
    var enteras = ""


    for(var i = 0; i < Math.floor(int); i++) {
        enteras = enteras.concat('<div class="bi-star-fill"></div>\n')
    }
    if(int === 0){
        return enteras
    }
    else if((int % 1) <= 0.5) {
        enteras = enteras.concat('<div class="bi-star-half"></div>\n')
    } else {
        enteras = enteras.concat('<div class="bi-star-fill"></div>\n')
    }
   

    return enteras
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
                        ${toStars(card.dificultatStars)}  <span class="text-muted">(${card.dificultatStars})<span>
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
                    <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="excursio.html?id=${card.id}">Hike it!</a></div>
                </div>
            </div>
        </div>
        `;
    
}

var card = {
    id: 0,
    nom: "",
    dificultatString: "",
    dificultatStars: "",
    distancia: "",
    desnivel: "",
    duration: "",
    urlFoto: ""
}


cardViewer();