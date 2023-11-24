// Recogemos el dado
const dice = document.querySelector(".die-list");
// Recogemos el boton del dado
const rollButton = document.getElementById("roll-button");
rollButton.addEventListener("click", rollDice);
// Asignamos la variable que va a determinar si va a estar girando false
let rolling = false;
// Declaramos un timeout. Este se activará en el caso de que salga un 6 
let magicNumber;
/**
 * Función que gira el dado
 */
function rollDice() {
  // Ahora está girando el dado
  rolling = true;
  // Desabilitamos el botón de giro
  rollButton.disabled = true;
  // Quitamos temporalmente el turno al jugador
  clicked = true;
  // Cambiamos el roll
  toggleClasses(dice);
  // Asignamos un numero aleatorio en el dado
  dice.dataset.roll = getRandomNumber(1, 6);
  if(dice.dataset.roll == 6) {
    magicNumber = setTimeout(letTheMachine, 2500);
    rolling = false;
  } else 
    setTimeout(() => { rolled = true; clicked = false; rolling = false; }, 1500)
}
  
function toggleClasses(die) {
  die.classList.toggle("odd-roll");
  die.classList.toggle("even-roll");
}
/**
 * Devuelve un numero aleatorio
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
