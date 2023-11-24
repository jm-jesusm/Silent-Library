// Asigna el numero de cartas totales que van a ser mostradas
const CARDSNO = 16;
// Asigna el numero de vidas que va a tener ambos jugadores
const LIVES = 3;
// Recoge la plantilla de la carta
const TEMPLATE = document.querySelector('.template');
// Puntos del usuario
let points = 0;
// Vidas del usuario
let selfLife = LIVES;
// Vidas de la máquina
let cpuLife = LIVES;
let cpuRow = document.querySelector('.cpu-hearts');
let playerRow = document.querySelector('.player-hearts');
for (let i = 0; i < LIVES; i++) {
    let heart = 
    `<div class="col">
         <img src="pubic/heart.png" alt="" class="img-fluid">
     </div> `;
    cpuRow.innerHTML += heart;
    playerRow.innerHTML += heart;
}


const cpuHearts = document.querySelectorAll('.cpu-hearts img');
const playerHearts = document.querySelectorAll('.player-hearts img');
let leaderboard = { };
// Recogemos el span en la ventana modal
let span = document.querySelector('.points');

// Añadimos al documento tantas cartas como han sido asignadas en CARDSNO
for (let i = 0; i < CARDSNO-1; i++) {
    let clonedNode = TEMPLATE.cloneNode(true);
    document.querySelector('.cards.row').appendChild(clonedNode);
}

// Seleccionamos los nodos imagen y los nodos de las cartas
const frontImg = document.querySelectorAll('.flip-card-front img');
const front = document.querySelectorAll('.flip-card-front');
let calaveras = [];

/**
 * Genera las cartas de reto (☠️)
 */
function assignCards() {
    
    // El numero de vidas representa que es a mejor de X, teniendo que 
    // generar un total de [vidas*2-1]
    for (let i = 0; i<LIVES*2-1; i++) {
        let rand;
        // Comprobamos que el numero aleatorio no ocupa una carta con calavera
        // En caso afirmativo volveremos a generar dicho numero
        do {
            rand = Math.floor(Math.random()*CARDSNO);
        } while(calaveras.includes(rand));
        // Una vez comprobado que es una carta neutral (SAFE), le reasignaremos
        // la imagen y el fondo
        frontImg[rand].src = "public/calavera.png";
        front[rand].style.backgroundColor =  "#FEF200";
        // Añadimos las calaveras para tenerlas rastreadas
        calaveras.push(rand);
    }
}

// Empezamos con la generación de cartas de reto 
assignCards();

// Recogemos todas las cartas y una carta con tamaño
const cards = document.querySelectorAll(".flip-card-inner");
const card = document.querySelector(".flip-card-front");
// Declaramos e inicializamos una flag a false
let clicked = false;
let rolled = false;


/**
 * Función que asigna la altura a una carta
 */
function sizeACard(card, cardHeight) {
    card.style.height = cardHeight+"px";
}
// Variables que almacenan los timeouts
let machineTime;
let grayHeart;

cards.forEach((element, index) => {
    // Dimensionamos todas las cartas
    sizeACard(element, card.offsetHeight);

    /**
     * Función que gira visualmente y lógicamente (eliminamos la clase "unknown") 
     * la carta. Esta función la realiza el jugador
     */
    function flipACard() {
        // Comprobamos que el usuario haya dejado tiempo a que la máquina
        // elija y no haya elegido una carta ya revelada
        if (!clicked  && element.classList.contains("unknown")) {
            rollButton.disabled = true;
            // Pasamos a conocer el contenido de la carta
            element.classList.remove("unknown");
            // Asignamos el turno al de la máquina
            clicked = true;
            // Dejamos que la máquina piense durante 1.250s
            machineTime = setTimeout(letTheMachine, 1250);
            if (calaveras.includes(index)) {
                selfLife--;
                // Oscurece el corazón
                grayHeart = setTimeout(() => {playerHearts[selfLife].style.filter = "grayScale(1)"}, 300);
                if (selfLife==0) 
                    clearTimeout(machineTime);
            } else{
                points+=100;
            }
        }
    }
    // Es el encargado de que el juego avance
    element.addEventListener('click', flipACard);
});
/**
 * Función que recoge todas las cartas y comprueba que no hayan sido 
 * levantadas anteriormente, tras ello devuelve el turno al jugador
 */
function letTheMachine() {
    // Recogemos todaas las cartas
    let cards = document.querySelectorAll('.flip-card-inner');
    // Elegimos un número aleatorio
    let rand = Math.floor(Math.random() * CARDSNO);
    // Si ha sido ya levantada, volvemos a ejecutar la función
    if (!cards[rand].classList.contains('unknown'))
        return letTheMachine();
    // Destapamos la carta
    cards[rand].classList.remove("unknown");
    // Comprobamos si esa carta es una calavera
    if (calaveras.includes(rand)) {
        cpuLife--;
        // Oscurece el corazón
        grayHeart = setTimeout(() => {cpuHearts[cpuLife].style.filter = "grayScale(1)"}, 300);
        if (cpuLife==0) {
            // Mostramos la ventana modal
            span.innerHTML = points *= selfLife;
            setTimeout(() => { 
                $.when( {cpuLife: 0} ).then(() => { $('#modal').modal('show'); }); 
            },300);
            return;  
        }
    }
    // Devolvemos el turno al jugador    
    clicked = false;
    rolled = false;
    rollButton.disabled = false;
}

// Cada vez que se redimensione la página, las cartas cambiarán de tamaño
addEventListener("resize", () => {
    cards.forEach(element => {
        sizeACard(element, card.offsetHeight);
    })
});

function resetCards() {
    // Comprobamos que el dado no esté girando
    if (!rolling) {
        // Le cancelamos el click al usuario
        clicked = true;
        // Reiniciamos el dado
        rolled = false;
        rollButton.disabled = false;
        // Le damos la vuelta a todas las cartas
        cards.forEach(element => {
            element.classList.add("unknown");
        })
        // Reiniciamos las calaveras
        calaveras = [];
        // Reiniciamos los puntos
        points = 0;
        // Ponemos el dado en 1
        document.querySelector(".die-list").dataset.roll = 1;
        // Limpiamos los levantamientos de la maquina
        clearTimeout(magicNumber);
        clearTimeout(machineTime);
        clearTimeout(grayHeart);
        // Esperamos un delay para que no se muesten las nuevas
        // Cartas mientras se giran
        setTimeout(()=> {
            // Declaramos todas las cartas neutrales
            frontImg.forEach(element => {
                element.src = "public/safe.png";
            });
            front.forEach(element => {
                element.style.backgroundColor = "white";
            });
            // Y asignamos las de reto
            assignCards();
            redHearts();
            // Permitimos de nuevo clicar a nuestro jugador
            clicked = false;
            // Reinicio de vidas
            selfLife = cpuLife = LIVES;
        }, 600);
    }
    /**
     * Función que vuelve a poner visualmente todos los corazones rojos
     */
    function redHearts() {
        for(let i = 0; i<LIVES; i++) {
            cpuHearts[i].style.filter = "grayScale(0)";
            playerHearts[i].style.filter = "grayScale(0)";
        }
    }
}
/**
 * Almacena el nombre del usuario en el leader y cambia la modal
 * @returns nothing
 */
function añadirLeader() {
    let nombre = document.getElementById('nikname');
    if(nombre.value == "") {
        nombre.style.borderColor = "red";
        return;
    }
        
    let leaderModal = document.querySelector('#modal2 .modal-body');
    leaderModal.innerHTML += `${nombre.value} -> ${points} <br>`; 
    $.when( {cpuLife: 0} ).then(() => { $('#modal').modal('hide'); });
    $.when( {cpuLife: 0} ).then(() => { $('#modal2').modal('show'); });
}