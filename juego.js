//Array que contendrá las cartas
let maso = [];
const tipos = ['C', 'D', 'H', 'S']; //Clumbs(treboles), Diamonds, Hearts, Spades
const especiales = ['A', 'J', 'Q', 'K'];

let puntosJugador = 0;
let puntosComputadora = 0;

//Elementos de la interfaz
const pedirCartaBtn = document.querySelector('#pedir-carta');
const detenerBtn = document.querySelector('#detener');
const cartasJugador = document.querySelector('#jugador-cartas');
const cartasComputadora = document.querySelector('#computadora-cartas');
const nuevoJuegoBtn = document.querySelector('#reiniciar');
const puntosSpan = document.querySelectorAll('span');


const llenarMaso = () => {
    for(let i = 2; i <= 10; i++){
        for (const tipo of tipos) {
            maso.push(i + tipo);
        }
    }

    for(let tipo of tipos){
        for(let especial of especiales){
            maso.push(especial + tipo);
        }
    }

    maso = _.shuffle(maso);
    
    return maso;
}

llenarMaso();


//Pedir carta
const pedirCarta = () => {
    if(maso.length === 0){
        console.error('Ya no quedan cartas en el maso');
        return;
    }

    const cartaRandom = maso[0]; //posicion 0 porque la funcion shuffle de underscore ya mezclo todos los elementos y quedan al azar.
    
    //Eliminar del maso la carta que nos dieron
    maso.shift(); //eliminar el primer elemento del array

    return cartaRandom;
}


//Valor de cartas
const valorCarta = (carta) => {
    const valor = carta.substring(0, carta.length - 1);

    return (isNaN(valor) && valor === 'A') ? 11 : (isNaN(valor)) ? 10 : parseInt(valor);
}

//Alerta
const mostrarAlerta = (tipo) => {
    pedirCartaBtn.disabled = true;

    const alertaContenedor = document.querySelector('.alerta');

    const alerta = document.createElement('P');
    alerta.classList.add('p-2', 'text-center', 'font-bold', 'text-2xl', 'mt-5', 'text-white');

    if(tipo === 'derrota'){
        alerta.textContent = 'PERDISTE EL JUEGO';
        alerta.classList.add('bg-red-600')
    }else if(tipo === 'victoria'){
        alerta.textContent = '¡GANASTE EL JUEGO!';
        alerta.classList.add('bg-green-600')
    }else{
        alerta.textContent = '¡EMPATE!';
        alerta.classList.add('bg-blue-600')
    }

    alertaContenedor.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

//LOGICA COMPUTADORA
const turnoComputadora = (puntosMinimos) => {
    do {
        const carta = pedirCarta();

        puntosComputadora = puntosComputadora + valorCarta(carta);
    
        puntosSpan[1].textContent = puntosComputadora;
    
        const cartaHtml = document.createElement('IMG');
        cartaHtml.className = 'w-24 mt-5 relative left-10 -ms-8';
        cartaHtml.src = `cartas/${carta}.png`;
    
        cartasComputadora.appendChild(cartaHtml);

        if(puntosMinimos >= 21){
            break;
        }

        
    } while ( (puntosComputadora < puntosMinimos) && (puntosMinimos <= 21) );

    if(puntosComputadora === puntosMinimos){
        mostrarAlerta('empate');
        return;
    }else if(puntosComputadora > 21 && puntosMinimos < 21){
        mostrarAlerta('victoria');
        return;
    }else if(puntosComputadora === 21 && puntosMinimos < 21){
        mostrarAlerta('derrota');
        return;
    }else if(puntosComputadora > puntosMinimos && puntosComputadora < 21){
        mostrarAlerta('derrota');
        return;
    }
}



//Carta DOM
const agregarCarta = () => {
    const carta = pedirCarta();

    puntosJugador = puntosJugador + valorCarta(carta);

    puntosSpan[0].textContent = puntosJugador;

    const cartaHtml = document.createElement('IMG');
    cartaHtml.className = 'w-24 mt-5 relative left-10 -ms-8';
    cartaHtml.src = `cartas/${carta}.png`;

    cartasJugador.appendChild(cartaHtml);

    //Alertas
    if(puntosJugador > 21){
        mostrarAlerta('derrota');
        detenerBtn.disabled = true;
        turnoComputadora(puntosJugador);
        
        return;
    }else if(puntosJugador === 21){
        mostrarAlerta('victoria');
        detenerBtn.disabled = true;
        turnoComputadora(puntosJugador);

        return;
    }
}


pedirCartaBtn.addEventListener('click', agregarCarta);


detenerBtn.addEventListener('click', () => {
    pedirCartaBtn.disabled = true;
    detenerBtn.disabled = true;

    turnoComputadora(puntosJugador);
})

nuevoJuegoBtn.addEventListener('click', () => {
    maso = [];
    maso = llenarMaso();

    puntosComputadora = 0;
    puntosJugador = 0;

    puntosSpan[0].textContent = puntosJugador;
    puntosSpan[1].textContent = puntosComputadora;

    cartasJugador.innerHTML = '';
    cartasComputadora.innerHTML = '';

    pedirCartaBtn.disabled = false;
    detenerBtn.disabled = false;
})