let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

let horariosApertura = 'LUNES A VIERNES DE 10:00 AM - 6:00 PM'


document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
});

function iniciarApp() {

    mostrarServicios();
    //Resalta el div actual segun el tab al que se presiona
    mostrarSeccion();
    //Ocuta o muestra una sección sefun el tab al que se presiona
    cambiarSeccion();

    //Paginacion siguiente y anterior

    paginaSiguiente();

    paginaAnterior();

    // Comprueba la pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();

    // Muestra el resumen de la cita o mensaje de error en caso de no pasar la validacion
    mostrarResumen();

    // Almacena el nombre de la cita en el objeto
    nombreCita();

    // Almacena la fecha de la cita en el objeto
    fechaCita();

    // Deshabilita dias pasados
    deshabilitarFechaAnterior();

    // Almacena la hora de la cita
    horaCita();


}

function mostrarSeccion() {

    // Eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // Eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');

    }
    // Resalta el Tab Actual
    const tab = document.querySelector(`[data-paso= "${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {

    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach(enlance => {
        enlance.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);
            //Llamar la funcion de mostrar seccion
            cambiarSeccion();
            botonesPaginador();
        })
    })
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();

        const { servicios } = db;

        // Generar HTML
        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio;

            //DOM Scripting
            //Generar Nombre de Servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            


            //Generar Precio de Servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //Generar Div contenedor de servicio

            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            //Selecciona un Servicio para la Cita
            servicioDiv.onclick = seleccionarServicio;

            // Inyectar precio y nombre al div de servicio

            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //Inyectarlo en el HTML
            document.querySelector('#servicios').appendChild(servicioDiv)
        })



    } catch (error) {
        console.log('Error')
    }
}


function seleccionarServicio(e) {

    let elemento;
    // Forzar el elemento al cual le damos click sea el DIV
    if (e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }
    // Agregar y quitar el elemento de la clase
    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');


        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextSibling.textContent
        }
        //console.log(servicioObj); 

        agregarServicio(servicioObj);
    }

}

function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);

    console.log(cita);
}

function agregarServicio(servicioObj) {
    const { servicios } = cita;

    cita.servicios = [...servicios, servicioObj];
    console.log(cita);
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        console.log(pagina);
        botonesPaginador();
    })
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        console.log(pagina);
        botonesPaginador();
    })
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if (pagina == 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (pagina == 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); // Estamos en la pagina 3, carga el resumen de la cita.
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion(); // Cambia la seccion que se muestra por la de la pagina
}


function mostrarResumen() {
    // Destructuring

    const { nombre, fecha, hora, servicios } = cita;

    // Seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    // Limpia todo el HTML
    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    // Validación de objeto
    if (Object.values(cita).includes("")) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios, Hora, Fecha o Nombre'
        noServicios.classList.add('invalidar-cita');

        // Agregar a resumen DIV
        resumenDiv.appendChild(noServicios);

        return;
    }

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';

    // Mostrar el Resumen

    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span>  ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha de la cita:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora de la cita:</span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;

       // Iterar sobre el arreglo de servicios
       servicios.forEach( servicio => {

        const { nombre, precio } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');
        // console.log(parseInt( totalServicio[1].trim() ));

        cantidad += parseInt( totalServicio[1].trim());

        // Colocar texto y precio en el div
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);

    } );

    console.log(cantidad)

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a Pagar:  </span> $ ${cantidad}`;


    resumenDiv.appendChild(cantidadPagar);

}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e => { // o se puede agregar change
        const nombreTexto = e.target.value.trim();
        console.log(nombreTexto);

        // Validacion nombre texto debe de tener algo
        if (nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('Nombre no valido', 'error');
        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
            console.log(cita);
        }
    })

}

function mostrarAlerta(mensaje, tipo) {

    // Si hay una alerta previo no crear otra
    const alertaPrevia = document.querySelector('.alerta')
    if (alertaPrevia) {
        return;
    }


    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error') {
        alerta.classList.add('error');
    }

    // Insertar en el HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);
    console.log(alerta)

    // Eliminar la alerta despues de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        console.log(e.target.value);

        const dia = new Date(e.target.value).getUTCDay(); // getUTCDate() retorna # del 0 - 6 siendo 0: domingo 6:sabado

        if ([0, 6].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de semana cerrado', 'error');
        } else {
            cita.fecha = fechaInput.value;
            console.log(cita);
        }

    })
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;


    // Formato : AAAA-MM-DD
    const fechaDeshabilitar = `${year}-${mes < 10 ? `0${mes}` : mes}-${dia < 10 ? `0${dia}` : dia}`;

    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('change', e => {

        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if (hora[0] < 10 || hora[0] > 18) {
            mostrarAlerta(`Los Horarios de apertura son: ${horariosApertura}`, 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 3000);

        } else {
            cita.hora = horaCita;

            console.log(cita);
        }

    });
}