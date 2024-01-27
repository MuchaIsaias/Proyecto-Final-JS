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

fetch('./js/usuarios.json')
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
    fetch('usuarios.json')
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
            let resp = await fetch ('./js/usuarios.json');
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

let formularioBusqueda3 = document.getElementById('formularioBusqueda');
let buscadorInput3 = document.getElementById('buscador');
let listaProductos3 = document.getElementById('listaProductos');

formularioBusqueda3.addEventListener('submit',(evt)=>{
    evt.preventDefault()
    let busqueda3 = buscadorInput3.value.toLowerCase();

    fetch("./js/productos.json")
    .then(response =>response.json())
    .then(data=>{
        let productosFiltrados = data.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda3)
    );
    listaProductos3.innerHTML = '';
    sessionStorage.setItem('productosFiltrados', JSON.stringify(productosFiltrados));
    window.location.href = './page/resultadodebusqueda.html';
    })
    .catch(error=>console.log(error));
});


document.addEventListener('DOMContentLoaded', function () {
    fetch("./js/productos.json")
        .then(response => response.json())
        .then(data => {
            render_Productos2(data);
            agregarEventos2();
        })
        .catch(error => console.log(error));
});



function render_Productos2(datas) {
    let contenedor_productos=document.querySelector(".todos-los-productos");
    datas.forEach((elm)=>{
    let template_productos=document.querySelector(".template-productos").content.cloneNode(true);
    let id_prodcutos=template_productos.querySelector(".contenedor-productos");
    id_prodcutos.setAttribute('data-product-id', elm.id);
    template_productos.querySelector(".nombre-producto").innerText=elm.nombre;
    template_productos.querySelector(".precio-producto").innerText="$"+elm.precio;
    let rutaOriginal = elm.img;
    let nuevaRuta = rutaOriginal.replace("../", "./") ;  
    template_productos.querySelector(".img-productos").src = nuevaRuta;

    contenedor_productos.append(template_productos);
});
}

function agregarEventos2() {
    let botones_productos = document.querySelectorAll('.btn-agregar-carrito');
    botones_productos.forEach(function (boton) {
        boton.addEventListener('click', function (  ) {
            console.log("hola");
            let productIdd = this.closest(".contenedor-productos").dataset.productId;
            console.log(productIdd);
            agregarAlCarrito(productIdd);
        });
    });
}
async function agregarAlCarrito(productId) {
    try {
        let userId = obtenerIdUsuario();
        let response = await fetch('./js/usuarios.json');
        let data = await response.json();

        let usuario = data.find(user => user.id === userId);

        if (usuario) {
            let producto = await obtenerProductoPorId(productId);

            if (producto) {
                usuario.carrito.push(producto);

                // Actualizar solo el usuario en el servidor
                let updateUrl =`http://localhost:4000/actualizar-carrito/${userId}`;

                await fetch(updateUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ carrito: usuario.carrito }),
                });

                console.log(`Producto agregado al carrito de ${usuario.nombre}`);
                console.log(data)
            } else {
                console.error(`Producto con ID ${productId} no encontrado.`);
            }
        } else {
            let producto = await obtenerProductoPorId(productId);
            carrito_sin_login.push(producto);
            sessionStorage.setItem('carritos', JSON.stringify(carrito_sin_login));
            console.log(carrito_sin_login);
        }
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
    }
}

async function obtenerProductoPorId (idd) {
    try {
        let resp = await fetch ('./js/productos.json');
        let data = await resp.json();
        console.log(data)
        return data.find(producto => producto.id === idd);
    } catch (error) {
        console.log(error)
    }
}



