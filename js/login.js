class Usuario {
    constructor(id, nombre, contraseña) {
        this.id = id;
        this.nombre = nombre;
        this.contraseña = contraseña;
        this.carrito = [];
    }
}

let registro= document.querySelector(".contenedor-registro");
let inicio= document.querySelector(".contenedor-inicio")
let login= document.querySelector(".contenedor-login")
let template_login= document.querySelector(".template-login")
let body_header=document.querySelector(".body_header")
let contenido_login = template_login.content
let clon_login=contenido_login.cloneNode(true)

fetch('/js/usuarios.json')
    .then(response => response.json())
    .then(data =>{
    console.log('Usuario actuales:',data)
    })
    .catch(error => console.error('Error al guardar el usuario:',error));

let url2 = 'http://localhost:4000/crear-usuario';

registro.addEventListener('submit', (evt) => {
    evt.preventDefault();
    let registro_nombre = registro.querySelector(".contenedor-registro_input-nombre").value;
    let registr_contraseña = registro.querySelector(".contenedor-registro_input-contraseña").value;
    fetch('/js/usuarios.json')
        .then(response => response.json())
        .then(data =>{
            console.log(data)
            let numberID = data.length + 1;
            let nuevoUsuario = new Usuario(numberID.toString(), registro_nombre, registr_contraseña);
            console.log( JSON.stringify(nuevoUsuario))
            let opciones = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevoUsuario),
            };
            let url2 = 'http://localhost:4000/crear-usuario';
            let usuarioExistente = data.find(usuario => usuario.nombre === registro_nombre);
            if (usuarioExistente) {
                alert("Nombre de usuario ya existente");
            }else{
                fetch(url2,opciones)
                .then(response => response)
                .then(data =>{
                    console.log('Usuario guardado exitosamente:', data)
                    window.location.reload();
                })
                .catch(error => console.error('Error al guardar el usuario:', error));
            }
    })
});

//Funciona

inicio.addEventListener('submit', (evt  ) => {
    evt.preventDefault();
    let inicio_nombre = inicio.querySelector(".contenedor-inicio_input-nombre").value;
    let inicio_contraseña = inicio.querySelector(".contenedor-inicio_input-contraseña").value;
    let usuarioEncontrado = false;
    loader(inicio_nombre,inicio_contraseña);
});

window.addEventListener('load', () => {
    let isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        login.style.display = "none";   
        body_header.appendChild(clon_login);
        
        let botonSesion = document.querySelector(".content-login .cerrar");
        
        if (botonSesion) {
            botonSesion.addEventListener('click', () => {
                sessionStorage.setItem('isLoggedIn', 'false');
                window.location.reload();
            });
        } else {
            console.error("No se encontró el botón de sesión");
        }
    }
}); 

async function loader (inicio_nombre,inicio_contraseña) {
        try {
            let resp = await fetch ('../js/usuarios.json');
            let data = await resp.json();
            let usuarioEncontrado= false
            console.log(data)
            data.forEach(usuario => {
                if (inicio_nombre === usuario.nombre && inicio_contraseña === usuario.contraseña) {
                    usuarioEncontrado = true;
                    let idUsuarioEncontrado = usuario.id;
                    sessionStorage.setItem('id', idUsuarioEncontrado);
                    sessionStorage.setItem('isLoggedIn', 'true');
                    window.location.reload();
                }
            });
            if (!usuarioEncontrado) {
                alert("Cuenta Incorrecta");
                sessionStorage.setItem('isLoggedIn', 'false');
            }
        } catch (error) {
            console.log(error)
        }
    }

function obtenerIdUsuario() {
    let idUsuarioRecuperar= sessionStorage.getItem('id')
    let isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            return idUsuarioRecuperar
        }else{
            return null
        }
}