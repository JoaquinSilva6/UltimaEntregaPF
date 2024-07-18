class Usuario {
    constructor(nom, contac) {
        this.nombre = nom
        this.contacto = contac
        this.horasAgenda = []
        this.vip = {esVip: false, cap : ''}
    }
}
// funciones---------------
//      Profe: No tengo mucha justificación para haber usado la api de rick y morty pero no se me ocurrio que otra usar para una agenda (y también me gusta rick y morty asi que quería trabajar con la api) jeje espero me la perdone 🙇‍♂️🙇‍♂️
async function obtenerCaps() {
    let listaCaps = []
    let url = 'https://rickandmortyapi.com/api/episode/'

    try {
        //cuando no queden más urls en la propiedad next devuelve null y sale del bucle
        while (url) {
            let response = await fetch(url)
            let data = await response.json()
            listaCaps = listaCaps.concat(data.results)
            url = data.info.next
        }
        agregar_caps(listaCaps)
    } catch (error) {
        console.error(error)
    }
}

function agregar_caps(datos) {
    datos.forEach(element => {
        caps.push(element)
    })
}
//-------------------------

let formulario1 = document.querySelector('#formAgenda')
let formulario2 = document.querySelector('#formConsulta')
let vipcheck = document.querySelector('#VIP')
let vipDiv = document.querySelector('#divVIP')

//agregamos los caps de la api a la lista
let caps = []
obtenerCaps()


//         Eventos form             
formulario1.addEventListener('submit', (ev) => {
    ev.preventDefault()
    if (formulario1[0].value != '' && formulario1[1].value != '' && formulario1[2].value != '--') {
        let nombre = formulario1[0].value
        let contacto = formulario1[1].value
        let horario = formulario1[2].value
        let usuario1 = new Usuario(nombre, contacto)
        if (vipcheck.checked) {
            usuario1.vip.esVip = true;
            usuario1.vip.cap = formulario1[4].value;
        } else {
            usuario1.vip.esVip = false;
        }
        
        //verificamos horario
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || []
        if (usuarios.find((e) => e.horasAgenda == horario)) {
            document.querySelector('#horaYaAgendada').className = 'visible'
        }
        else {
            usuario1.horasAgenda.push(horario)
            usuarios.push(usuario1)
            localStorage.setItem('usuarios', JSON.stringify(usuarios))
            Swal.fire({
                title: "Un Exito!!",
                text: "Lo malo es que se me bugeo el estilo de la alerta 💀💀💀",
                icon: "success",
                confirmButtonText: 'Aceptar',
                customClass: {
                    title: 'mi-titulo',
                    htmlContainer: 'mi-texto'
                }
              });
            document.querySelector('#oculto').className = 'oculto'
        }
    }
    else {
        document.querySelector('#oculto').className = 'visible'
    }
})

vipcheck.addEventListener('click', () => {
    if (vipcheck.checked) {
        document.querySelector('#divVIP').className = 'visible'
        vipDiv.childNodes[5].innerHTML = ''
        //agregamos los caps a la lista de opciones del input
        for(let i = 0; i < caps.length; i++){
        vipDiv.childNodes[5].innerHTML += `<option value="${caps[i].id}">${caps[i].id} - ${caps[i].name}</option>`
        }
    }
    else {
        document.querySelector('#divVIP').className = 'oculto'
    }
})

formulario2.addEventListener('submit', (ev) => {
    ev.preventDefault()
    let contacto = document.querySelector('#consCont').value
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || []
    let usuario = usuarios.find((e) => e.contacto === contacto)

    if (usuario) {
        let interiorHTML = ''
        usuario.horasAgenda.forEach(hora => {
            interiorHTML += `<li>Tiene turno a las ${hora}</li>`
        })
        document.querySelector('#listaHoras').innerHTML = interiorHTML
    } else {
        document.querySelector('#listaHoras').innerHTML = '<li>No se encontraron horarios agendados para este contacto</li>'
    }
})
//--------------------