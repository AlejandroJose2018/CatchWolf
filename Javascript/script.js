document.addEventListener("keydown", moverLobo);
window.setInterval(moverPersonajes, 250);

var vp = document.getElementById("villaplatzi");
var tablero_dat = document.getElementById("tablero_datos");
var papel = vp.getContext("2d");
var cantidad = aleatorio(0, 50);

var fondo = cargarRecurso("./img/tile.png", "Fondo");
var vaca = cargarRecurso("./img/vaca.png", "Vaca");
var pollo = cargarRecurso("./img/pollo.png", "Pollo");
var cerdo = cargarRecurso("./img/cerdo.png", "Cerdo");
var lobo = cargarRecurso("./img/lobo.png", "Lobo");
var guauf = cargarRecurso("./img/pollo.png", "Mordida");
var personajes = [vaca, pollo, cerdo];
var teclas = {LEFT:37, UP:38, RIGHT:39, DOWN:40, SPACE:32};
var activar_tiempo_tablero = true;

var etiquetas_dinamicas = {};

var tablero = {
tiempo: 40, 
mordidas: 30
}

dibujarTablero();

function cargarRecurso(strurl, strid){
var personaje = {
 url:strurl,
 cargaOk:false,
 cantidad:aleatorio(1, 5),
 id:strid,
 coordenadas:{ejex:[], ejey:[]},
 ocultar:{valor:[]}
};
personaje.imagen = new Image();
personaje.imagen.src = personaje.url;
personaje.imagen.addEventListener("load", function (evento){
personaje.cargaOk = true;
dibujar();
});
return personaje;
}

function moverPersonajes(){
for (var i = 0; i < personajes.length; i++) {
var personaje = personajes[i];
if (personaje.cargaOk) {
  for (var j = 0; j < personaje.cantidad; j++) {
      personaje.coordenadas.ejex[j] += aleatorio(-2, 2)*5;
      personaje.coordenadas.ejey[j] += aleatorio(-2, 2)*5;
  }
  dibujar();
}
}
}


function moverLobo(evento){
var movimientos = 10;
if(evento.keyCode == teclas.LEFT){
lobo.coordenadas.ejex[0] = lobo.coordenadas.ejex[0] - movimientos;
dibujar();
}
if(evento.keyCode == teclas.UP){
lobo.coordenadas.ejey[0]  = lobo.coordenadas.ejey[0] - movimientos;
dibujar();
}
if(evento.keyCode == teclas.RIGHT){
lobo.coordenadas.ejex[0] = lobo.coordenadas.ejex[0] + movimientos;
dibujar();
}
if(evento.keyCode == teclas.DOWN){
lobo.coordenadas.ejey[0] = lobo.coordenadas.ejey[0] + movimientos;
dibujar();
}
if(evento.keyCode == teclas.SPACE){
guauf.mostrar = true;
tablero.mordidas--;
var etiqueta = etiquetas_dinamicas["mordisco"];
etiqueta.innerText = tablero.mordidas;
ocultaPersonajes();
dibujar();
window.setTimeout(apagarLadrido, 500);
}
}

function ocultaPersonajes(){
for (var i = 0; i < personajes.length; i++) {
var personaje = personajes[i];
if (personaje.cargaOk) {
  for (var j = 0; j < personaje.cantidad; j++) {
    if(!personaje.ocultar.valor[j]){
      var diferenciax = personaje.coordenadas.ejex[j]-(lobo.coordenadas.ejex[0]+lobo.imagen.width/2);
      var diferenciay = personaje.coordenadas.ejey[j]-(lobo.coordenadas.ejey[0]-lobo.imagen.height/2);
      var ancholobo = lobo.imagen.width;
      var largolobo = lobo.imagen.height;
      if(diferenciax > 0 && diferenciax <= 40 && diferenciay > 0 && diferenciay <= 40){
        personaje.ocultar.valor[j] = true;
        personaje.cantidad--;
        var etiqueta = etiquetas_dinamicas[personaje.id];
        etiqueta.innerText = personaje.cantidad;
      }
    }
  }
}
}
}

function apagarLadrido(){
guauf.mostrar = false;
console.log("ya no mordí");
dibujar();
}

function dibujar(){
if(fondo.cargaOk){
papel.drawImage(fondo.imagen, 0, 0);
}
for (var i = 0; i < personajes.length; i++) {
var personaje = personajes[i];
if (personaje.cargaOk) {
  for (var j = 0; j < personaje.cantidad; j++) {
    if(!personaje.ocultar.valor[j]){
      if(!personaje.coordenadas.ejex[j]){
        personaje.coordenadas.ejex[j] = aleatorio(0, 7)*60;
      }
      if(!personaje.coordenadas.ejey[j]){
        personaje.coordenadas.ejey[j] = aleatorio(0, 7)*60;
      }
      papel.drawImage(personaje.imagen, personaje.coordenadas.ejex[j], personaje.coordenadas.ejey[j]);
    }
  }
}
}
if(lobo.cargaOk){
if(!lobo.coordenadas.ejex[0] || !lobo.coordenadas.ejey[0]){
  lobo.coordenadas.ejex[0] = 200;
  lobo.coordenadas.ejey[0] = 300;
}
papel.drawImage(lobo.imagen, lobo.coordenadas.ejex[0], lobo.coordenadas.ejey[0]);
}
if(guauf.cargaOk && guauf.mostrar){
papel.drawImage(guauf.imagen, lobo.coordenadas.ejex[0]+25, lobo.coordenadas.ejey[0]-10);
}
if(activar_tiempo_tablero){
activar_tiempo_tablero = false;
window.setInterval(disminuirTiempo, 1000);
}
}

function aleatorio(min, max){
var resultado;
resultado = Math.floor(Math.random()*(max-min+1))+min;
return resultado;
}

function dibujarTablero(){
var texto = "Tiempo: "+tablero.tiempo+"s";
var table = document.createElement("table");
for (var i = 0; i < personajes.length; i++) {
var personaje = personajes[i];
var tr = document.createElement("tr");
tr.appendChild(crearElemento("td", personaje.id+":"));
tr.appendChild(crearElemento("td", personaje.cantidad, personaje.id));
table.appendChild(tr);
}
var trmordiscos = document.createElement("tr");
trmordiscos.appendChild(crearElemento("td", "Mordisco:"));
trmordiscos.appendChild(crearElemento("td", tablero.mordidas, "mordisco"));
var trtiempo = document.createElement("tr");
trtiempo.appendChild(crearElemento("td", "Tiempo:"));
trtiempo.appendChild(crearElemento("td", tablero.tiempo, "tiempo"));
table.appendChild(trmordiscos);
table.appendChild(trtiempo);
tablero_dat.appendChild(table);
}

function crearElemento(etiqueta, valor, id){
var etiqueta = document.createElement(etiqueta);
if(valor){
etiqueta.innerText = valor;
if(id){
  etiqueta.setAttribute("id", id);
  etiquetas_dinamicas[id] = etiqueta;
}
}
return etiqueta;
}

function disminuirTiempo(){
tablero.tiempo--;
var etiqueta = etiquetas_dinamicas["tiempo"];
etiqueta.innerText = tablero.tiempo;
}
