(function(){

    let maso = [];
    const tipos = ['C', 'D', 'H', 'S'],    //Clumbs(treboles), Diamonds, Hearts, Spades
          especiales = ['A', 'J', 'Q', 'K'];

    let puntosJugadores = [];

    //Elementos de la interfaz
    const pedirCartaBtn = document.querySelector('#pedir-carta'),
        detenerBtn = document.querySelector('#detener'),
        divCartasJugadores = document.querySelectorAll('.cartasJugador'),
        nuevoJuegoBtn = document.querySelector('#reiniciar'),
        puntosSpan = document.querySelectorAll('span'),
        alertaContenedor = document.querySelector('.alerta');

    document.addEventListener('DOMContentLoaded', ()  => {
        pedirCartaBtn.disabled = true;
        detenerBtn.disabled = true;
    })

    const iniciarJuego = (cantidadJugadores = 2) => {
        maso = llenarMaso();

        puntosJugadores = [];

        alertaContenedor.innerHTML = '';

        for(let i = 0; i < cantidadJugadores; i++){
          puntosJugadores.push(0);
        }

        puntosSpan.forEach(punto => {
            punto.textContent = 0;
        })

        divCartasJugadores.forEach(cartas => {
            cartas.innerHTML = '';
        })

        pedirCartaBtn.disabled = false;
        detenerBtn.disabled = false;
    }


    const llenarMaso = () => {
        maso = [];

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

    }

    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] += valorCarta(carta);
        
        puntosSpan[turno].textContent = puntosJugadores[turno];

        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const cartaHtml = document.createElement('IMG');
        cartaHtml.className = 'w-24 mt-5 relative left-10 -ms-8';
        cartaHtml.src = `cartas/${carta}.png`;
        divCartasJugadores[turno].appendChild(cartaHtml);
    }

    //LOGICA COMPUTADORA
    const turnoComputadora = (puntosMinimos) => {
        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();

            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);

            crearCarta(carta, puntosJugadores.length - 1);

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

        let puntosJugador = acumularPuntos(carta, 0);

        crearCarta(carta, 0);

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

        turnoComputadora(puntosJugadores[0]);
    })

    nuevoJuegoBtn.addEventListener('click', () => {
        iniciarJuego();
    })

})();