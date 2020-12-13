function mover(accion, mapaActual, mapaMinas){
    acciones = ["up", "down", "left", "right"]
    if(acciones.indexOf(accion) == -1){
        return "error: accion no definida"
    }
    CARACTER_FIN = "@"
    if(mapaActual.indexOf(CARACTER_FIN) >= 0){
        return "error: no se puede ejecutar más acciones"
    }
    matrixActual = mapaActual.trim().split("\n")
    matrixMinas = mapaMinas.trim().split("\n")
    if(matrixActual.length == 0){
        return "error: mapa actual no puede ser vacío"
    }
    if(matrixMinas.length == 0){
        return "error: mapa minas no puede ser vacío"
    }
    rowsActual = matrixActual.length
    colsActual = matrixActual[0].length
    for(i = 0; i < matrixActual.length; i++){
        if(matrixActual[i].length != colsActual){
            return "error: dimensiones incorrectas para mapa actual"
        }
        matrixActual[i] = matrixActual[i].split("")
    }    
    rowsMinas = matrixMinas.length
    colsMinas = matrixMinas[0].length
    for(i = 0; i < matrixMinas.length; i++){
        if(matrixMinas[i].length != colsMinas){
            return "error: dimensiones incorrectas para mapa minas"
        }
    }
    if(rowsActual != rowsMinas || colsActual != colsMinas){
        return "error: dimesiones distintas para mapa actual y minas"
    }
    CARACTER_POSICION_ACTUAL = "+"
    x = -1
    y = -1
    for(i = 0; i < matrixActual.length; i++){
        x = matrixActual[i].indexOf(CARACTER_POSICION_ACTUAL)
        if(x >= 0){
            y = i
            break
        }
    }
    x0 = x
    y0 = y
    switch(accion){
        case 'up':
            y--
            break;
        case 'down':
            y++
            break;
        case 'left':
            x--
            break;
        case 'right':
            x++
            break;
    }
    if(x < 0){
        x = 0
    }
    if(x >= colsActual){
        x = colsActual - 1
    }
    if(y < 0){
        y = 0
    }
    if(y >= rowsActual){
        y = rowsActual - 1
    }
    
    CARACTER_MINA = "$"
    CARACTER_META = "#"
    CARACTER_VACIO = "0"
    if(CARACTER_MINA == matrixMinas[y][x]){
        matrixActual[y][x] = CARACTER_MINA
    }else if(CARACTER_META == matrixMinas[y][x]){
        matrixActual[y][x] = CARACTER_FIN
        matrixActual[y0][x0] = CARACTER_VACIO
    }else{
        //avanzar        
        matrixActual[y0][x0] = CARACTER_VACIO
        matrixActual[y][x] = CARACTER_POSICION_ACTUAL
    }
    result = []
    for(i = 0 ; i < matrixActual.length ; i++){
        result.push(matrixActual[i].join(""))
    }
    return result.join("\n")
}
function obtenerResultado(mapaActual, mapaPrevio){
    if(mapaActual == mapaPrevio){
        return "sin cambios"
    }
    if((mapaActual.match(/@/g) || []).length){
        return "fin"
    }
    minasActual = (mapaActual.match(/\$/g) || []).length //crea un array con cada caracter $ y cuenta los elementos
    minasPrevio = (mapaPrevio.match(/\$/g) || []).length 
    if(minasActual > minasPrevio ){
        return "mina"
    }
    if(minasActual == minasPrevio ){
        return "sin mina"
    }    
}
function obtenerMatrixDeMapa(mapa){
    matrixMapa = mapa.trim().split("\n")
    for(i = 0; i < matrixMapa.length; i++){
        matrixMapa[i] = matrixMapa[i].split("")
    }
    return matrixMapa
}

/*********************************A PARTIR DE AQUI EL CODIGO CORRESPONDE AL GRUPO***********************************************/
//genera las minas dentro de el array que representa el mapa
function generarMapaAleatorio(){
    var mopo = '+';
    var numDolar = 12;
    for (i = 0; i < 7; i++){
        var aleatorio = Math.random();
        if(aleatorio <= 0.1 && numDolar > 0){
            mopo = mopo + '$';
            numDolar = numDolar - 1;
        }
        else{
            mopo = mopo + '0';
        }
    }

    mopo = mopo + '\n';

    for (i = 0; i < 6; i++){
        for (j = 0; j < 8; j++){
            var aleatorio = Math.random();
            if(aleatorio <= 0.4 && numDolar > 0){
                mopo = mopo + '$';
                numDolar = numDolar - 1;
            }
            else{
                mopo = mopo + '0';
            }

        }
        mopo = mopo + '\n';
    }

    for (i = 0; i < 7; i ++){
        var aleatorio = Math.random();
        if(aleatorio <= 0.4 && numDolar > 0){
            mopo = mopo + '$';
            numDolar = numDolar - 1;
        }
        else{
            mopo = mopo + '0';
        } 
    }

    mopo = mopo + '#';


    if (numDolar > 0){
        generarMapaAleatorio(mopo);
    }


    return mopo;


}
//ejemplo
mapaInicial = `
+0000000
00000000
00000000
00000000
00000000
00000000
00000000
0000000#
`

mapaMinas = generarMapaAleatorio()  //asignar mapa aleatorio


//el boton "nuevo juego" acciona una recarga de pagina
function nuevoJuego() {
    location.reload()
}

//al presionar y levantar la direccion a que se movera el robot
document.body.addEventListener("keyup", desplazar, true);


mapaActual = mapaInicial
//contador para que el bot se mueva entre columnas
var contador = 1;   
//contador de vidas
var vidas = 3

//funcion para mover mediante el teclado
function desplazar(e){

    /*esta parte del codigo permite mostrar por pantalla
    un temporizador desde el momento en que se realiza el movimiento hasta la reaparicion de las flechas */
    var a = 0
    document.getElementById("tempor").style.opacity = "0"
    var interval = setInterval(function() {
        if (a < 3) {
            a++
            document.getElementById("tempor").style.opacity = "1"
            document.getElementById("tempor").innerHTML = a
        } else {
            document.getElementById("tempor").style.opacity = "0"
            clearInterval(interval)
        }
    }, 1000)


    //desaparecer llama a los controles para desaparecerlos al presionar alguna tecla
    var desaparecer = document.getElementById("controles")
    desaparecer.style.opacity = "0"
    
    //funcion para realizar un delay que llama a la funcion anonima de desplazar
    setTimeout(function(){
        console.log("Tecla pulsada es " + e.keyCode);

        //tomamos la iamgen que servira como objeto para ubicarnos en el mapa
        var imagen = document.getElementById("stonks");
        
        if (vidas >0) {
            switch (e.keyCode){
                case 38: //arriba
                    mapaPrevio = mapaActual
                    mapaActual = mover("up", mapaActual, mapaMinas);
                    console.log(mapaActual);
                    console.log(obtenerResultado(mapaActual, mapaPrevio));
                    
                    document.getElementById("tempor").innerHTML = obtenerResultado(mapaActual, mapaPrevio)
                    document.getElementById("tempor").style.opacity = "1"

                    //si es distinto a "mina" o "sin cambios", entonces se movera
                    if (obtenerResultado(mapaActual, mapaPrevio) != "mina") {
                        if (obtenerResultado(mapaActual, mapaPrevio) != "sin cambios") {
                            //Parte grafica para mmover
                            var x = imagen.parentElement;
                            var sigx = x.previousElementSibling;
                            sigx.appendChild(imagen);
                            contador = contador - 1;
                            
                            //manda un alert si el resultado es "fin"
                            if (obtenerResultado(mapaActual, mapaPrevio) == "fin") {
                                alert("ganaste pibardo")
                            }

                        }
                    } else {
                        //pintar casilla de rojo
                        var x = imagen.parentElement;
                        var sigx = x.previousElementSibling;
                        sigx.setAttribute("id", "bomba");
                        desaparecer.style.opacity = "1"

                        //cayo en "mina", por lo que se pierden vidas
                        vidas--
        
                        var vid = document.getElementById("numV")
                        vid.innerHTML = vidas
                    }
                    break;
                    
                case 40: //abajo
                    mapaPrevio = mapaActual
                    mapaActual = mover("down", mapaActual, mapaMinas);
                    console.log(mapaActual)
                    console.log(obtenerResultado(mapaActual, mapaPrevio))

                    document.getElementById("tempor").innerHTML = obtenerResultado(mapaActual, mapaPrevio)
                    document.getElementById("tempor").style.opacity = "1"

                    if (obtenerResultado(mapaActual, mapaPrevio) != "mina") {
                        if (obtenerResultado(mapaActual, mapaPrevio) != "sin cambios") {
                            var x = imagen.parentElement;
                            var sigx = x.nextElementSibling;
                            sigx.appendChild(imagen);
                            contador = contador + 1;
                            if (obtenerResultado(mapaActual, mapaPrevio) == "fin") {
                                alert("ganaste pibardo")
                                
                            }

                        }
                    } else {
                        var x = imagen.parentElement;
                        var sigx = x.nextElementSibling;
                        sigx.setAttribute("id", "bomba");
                        desaparecer.style.opacity = "1"
                        vidas--
        
                        var vid = document.getElementById("numV")
                        vid.innerHTML = vidas
                    }
                    break;
        
                case 37: //izquierda
                
                    mapaPrevio = mapaActual
                    mapaActual = mover("left", mapaActual, mapaMinas)
                    console.log(mapaActual)
                    console.log(obtenerResultado(mapaActual, mapaPrevio))

                    document.getElementById("tempor").innerHTML = obtenerResultado(mapaActual, mapaPrevio)
                    document.getElementById("tempor").style.opacity = "1"

                    if (obtenerResultado(mapaActual, mapaPrevio) != "mina") {
                        if (obtenerResultado(mapaActual, mapaPrevio) != "sin cambios") {
                            var colActual = imagen.parentElement.parentElement;
                            var sigCol = colActual.previousElementSibling;
                            var filaN = sigCol.firstElementChild;
                            cont = 1;
                            while(cont < contador){
                                filaN = filaN.nextElementSibling;
                                cont = cont + 1; 
                            }
                            filaN.appendChild(imagen);
                            if (obtenerResultado(mapaActual, mapaPrevio) == "fin") {
                                alert("ganaste pibardo")
                            }
                        }
                    } else {
                        var colActual = imagen.parentElement.parentElement;
                        var sigCol = colActual.previousElementSibling;
                        var filaN = sigCol.firstElementChild;
                        cont = 1;
                        while(cont < contador){
                            filaN = filaN.nextElementSibling;
                            cont = cont + 1; 
                        }
                        filaN.setAttribute("id", "bomba");
                        desaparecer.style.opacity = "1"
                        vidas--
        
                        var vid = document.getElementById("numV")
                        vid.innerHTML = vidas
                    }
                    break;
                case 39: //derecha
                    mapaPrevio = mapaActual
                    mapaActual = mover("right", mapaActual, mapaMinas)
                    console.log(mapaActual)
                    console.log(obtenerResultado(mapaActual, mapaPrevio))

                    document.getElementById("tempor").innerHTML = obtenerResultado(mapaActual, mapaPrevio)
                    document.getElementById("tempor").style.opacity = "1"

                    if (obtenerResultado(mapaActual, mapaPrevio) != "mina") {
                        if (obtenerResultado(mapaActual, mapaPrevio) != "sin cambios") {
                            var colActual = imagen.parentElement.parentElement;
                            var sigCol = colActual.nextElementSibling;
                            var filaN = sigCol.firstElementChild;
                            cont = 1;
                            while(cont < contador){
                                filaN = filaN.nextElementSibling;
                                cont = cont + 1; 
                            }
                            filaN.appendChild(imagen);
                            if (obtenerResultado(mapaActual, mapaPrevio) == "fin") {
                                alert("ganaste pibardo")
                            }

                        }
                    } else {
                        var colActual = imagen.parentElement.parentElement;
                        var sigCol = colActual.nextElementSibling;
                        var filaN = sigCol.firstElementChild;
                        cont = 1;
                        while(cont < contador){
                            filaN = filaN.nextElementSibling;
                            cont = cont + 1; 
                        }
                        filaN.setAttribute("id", "bomba");
                        desaparecer.style.opacity = "1"
                        vidas--
        
                        var vid = document.getElementById("numV")
                        vid.innerHTML = vidas
                    }
                    break;               
            }
        } else {
            alert("perdiste pibe")
        }
        //hacer reaparecer las flechas
        desaparecer.style.opacity = "1"
    }, 3000)   //delay de 3000ms == 3seg

}


//igual a la funcion de reemplazar, pero este no toma como parametro un "e"
function desplazarFlecha(idd){

    /*esta parte del codigo permite mostrar por pantalla
    un temporizador desde el momento en que se realiza el movimiento hasta la reaparicion de las flechas */
    var a = 1
    document.getElementById("tempor").style.opacity = "0"
    var interval = setInterval(function() {
        if (a < 3) {
            a++
            document.getElementById("tempor").style.opacity = "1"
            document.getElementById("tempor").innerHTML = a
        } else {
            document.getElementById("tempor").style.opacity = "0"
            clearInterval(interval)
        }
    }, 1000)

    //desaparece los controles al realizar la pulsacion de teclas
    var desaparecer = document.getElementById("controles")
    desaparecer.style.opacity = "0"

    setTimeout(function(){

        console.log("Tecla pulsada es " + idd);

        var imagen = document.getElementById("stonks");
        
        if (vidas >0) {
            switch (idd){
                case 38: //arriba
                    mapaPrevio = mapaActual
                    mapaActual = mover("up", mapaActual, mapaMinas);
                    console.log(mapaActual);
                    console.log(obtenerResultado(mapaActual, mapaPrevio))

                    document.getElementById("tempor").innerHTML = obtenerResultado(mapaActual, mapaPrevio)
                    document.getElementById("tempor").style.opacity = "1"

                    if (obtenerResultado(mapaActual, mapaPrevio) != "mina") {
                        if (obtenerResultado(mapaActual, mapaPrevio) != "sin cambios") {
                            //Parte grafica
                            var x = imagen.parentElement;
                            var sigx = x.previousElementSibling;
                            sigx.appendChild(imagen);
                            contador = contador - 1;
                            
                            if (obtenerResultado(mapaActual, mapaPrevio) == "fin") {
                                alert("ganaste pibardo")
                            }

                        }
                    } else {
                        var x = imagen.parentElement;
                        var sigx = x.previousElementSibling;
                        sigx.setAttribute("id", "bomba");
                        desaparecer.style.opacity = "1"
                        vidas--
        
                        var vid = document.getElementById("numV")
                        vid.innerHTML = vidas
                    }
                    break;
                    
                case 40: //abajo
                    mapaPrevio = mapaActual
                    mapaActual = mover("down", mapaActual, mapaMinas);
                    console.log(mapaActual)
                    console.log(obtenerResultado(mapaActual, mapaPrevio))

                    document.getElementById("tempor").innerHTML = obtenerResultado(mapaActual, mapaPrevio)
                    document.getElementById("tempor").style.opacity = "1"

                    if (obtenerResultado(mapaActual, mapaPrevio) != "mina") {
                        if (obtenerResultado(mapaActual, mapaPrevio) != "sin cambios") {
                            var x = imagen.parentElement;
                            var sigx = x.nextElementSibling;
                            sigx.appendChild(imagen);
                            contador = contador + 1;
                            if (obtenerResultado(mapaActual, mapaPrevio) == "fin") {
                                alert("ganaste pibardo")
                                
                            }

                        }
                    } else {
                        var x = imagen.parentElement;
                        var sigx = x.nextElementSibling;
                        sigx.setAttribute("id", "bomba");
                        desaparecer.style.opacity = "1"
                        vidas--
                        var vid = document.getElementById("numV")
                        vid.innerHTML = vidas
                    }
                    break;
        
                case 37: //izquierda
                    mapaPrevio = mapaActual
                    mapaActual = mover("left", mapaActual, mapaMinas)
                    console.log(mapaActual)
                    console.log(obtenerResultado(mapaActual, mapaPrevio))

                    document.getElementById("tempor").innerHTML = obtenerResultado(mapaActual, mapaPrevio)
                    document.getElementById("tempor").style.opacity = "1"

                    if (obtenerResultado(mapaActual, mapaPrevio) != "mina") {
                        if (obtenerResultado(mapaActual, mapaPrevio) != "sin cambios") {
                            var colActual = imagen.parentElement.parentElement;
                            var sigCol = colActual.previousElementSibling;
                            var filaN = sigCol.firstElementChild;
                            cont = 1;
                            while(cont < contador){
                                filaN = filaN.nextElementSibling;
                                cont = cont + 1; 
                            }
                            filaN.appendChild(imagen);
                            if (obtenerResultado(mapaActual, mapaPrevio) == "fin") {
                                alert("ganaste pibardo")
                            }
                        }
                    } else {
                        var colActual = imagen.parentElement.parentElement;
                        var sigCol = colActual.previousElementSibling;
                        var filaN = sigCol.firstElementChild;
                        cont = 1;
                        while(cont < contador){
                            filaN = filaN.nextElementSibling;
                            cont = cont + 1; 
                        }
                        filaN.setAttribute("id", "bomba");
                        desaparecer.style.opacity = "1"
                        vidas--
                        var vid = document.getElementById("numV")
                        vid.innerHTML = vidas
                    }
                    break;
                case 39: //derecha
                    mapaPrevio = mapaActual
                    mapaActual = mover("right", mapaActual, mapaMinas)
                    console.log(mapaActual)
                    console.log(obtenerResultado(mapaActual, mapaPrevio))

                    document.getElementById("tempor").innerHTML = obtenerResultado(mapaActual, mapaPrevio)
                    document.getElementById("tempor").style.opacity = "1"

                    if (obtenerResultado(mapaActual, mapaPrevio) != "mina") {
                        if (obtenerResultado(mapaActual, mapaPrevio) != "sin cambios") {
                            var colActual = imagen.parentElement.parentElement;
                            var sigCol = colActual.nextElementSibling;
                            var filaN = sigCol.firstElementChild;
                            cont = 1;
                            while(cont < contador){
                                filaN = filaN.nextElementSibling;
                                cont = cont + 1; 
                            }
                            filaN.appendChild(imagen);
                            if (obtenerResultado(mapaActual, mapaPrevio) == "fin") {
                                alert("ganaste pibardo")
                            }

                        }
                    } else {
                        var colActual = imagen.parentElement.parentElement;
                        var sigCol = colActual.nextElementSibling;
                        var filaN = sigCol.firstElementChild;
                        cont = 1;
                        while(cont < contador){
                            filaN = filaN.nextElementSibling;
                            cont = cont + 1; 
                        }
                        filaN.setAttribute("id", "bomba");
                        desaparecer.style.opacity = "1"
                        vidas--
        
                        var vid = document.getElementById("numV")
                        vid.innerHTML = vidas
                    }
                    break;               
            }
        } else {
            alert("perdiste pibe")
        }
        
        desaparecer.style.opacity = "1"
    }, 3000)
    a= 0
}



