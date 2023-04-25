const mapOverlay = document.querySelector('.map-container');
const mapOverlayMessage = document.querySelector('.b-message');
const map = document.querySelector('.mapa');

mapOverlay.addEventListener('click', () => {
  map.style.pointerEvents = 'auto'; // activar eventos del ratón para el iframe
  mapOverlayMessage.style.display = 'none'; // ocultar el overlay
});

map.addEventListener('mouseleave', () => {
  map.style.pointerEvents = 'none'; // desactivar eventos del ratón para el iframe
  mapOverlayMessage.style.display = 'block'; // mostrar el overlay
});

function showExcursio(){
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const excursioId = params.get("id");
    
    
}
showExcursio()