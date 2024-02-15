class Usuario {
    constructor(id, nombre, contraseña) {
        this.id = id;
        this.nombre = nombre;
        this.contraseña = contraseña;
        this.carrito = [];
    }
}
let carrito_sin_login=[]
let registro= document.querySelector(".contenedor-registro");
let inicio= document.querySelector(".contenedor-inicio")
let login= document.querySelector(".contenedor-login")
let template_login= document.querySelector(".template-login")
let body_header=document.querySelector(".body_header")
let contenido_login = template_login.content
let clon_login=contenido_login.cloneNode(true)

registro.addEventListener('submit', (evt) => {
    evt.preventDefault();

    let registro_nombre = registro.querySelector(".contenedor-registro_input-nombre").value;
    let registr_contraseña = registro.querySelector(".contenedor-registro_input-contraseña").value;
    
    let todosLosUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    if (todosLosUsuarios.length === 0) {
        let numberID = todosLosUsuarios.length + 1;
        let nuevoUsuario = new Usuario(numberID.toString(), registro_nombre, registr_contraseña);
        todosLosUsuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(todosLosUsuarios));
        window.location.reload();
    } else {
        let usuarioExistente = todosLosUsuarios.find(usuario => usuario.nombre === registro_nombre);

        if (usuarioExistente) {
            alert("Nombre de usuario ya existente");
        } else {
            let numberID = todosLosUsuarios.length + 1;
            let nuevoUsuario = new Usuario(numberID.toString(), registro_nombre, registr_contraseña);
            todosLosUsuarios.push(nuevoUsuario);
            localStorage.setItem('usuarios', JSON.stringify(todosLosUsuarios));
            window.location.reload();
        }
    }
});
todosLosUsuarios = JSON.parse(localStorage.getItem('usuarios'))
console.log(todosLosUsuarios)

//Funciona

inicio.addEventListener('submit', () => {
    let inicio_nombre = inicio.querySelector(".contenedor-inicio_input-nombre").value;
    let inicio_contraseña = inicio.querySelector(".contenedor-inicio_input-contraseña").value;
    todosLosUsuarios = JSON.parse(localStorage.getItem('usuarios'))
    let usuarioEncontrado = false;
    todosLosUsuarios.forEach(usuario => {
        if (inicio_nombre === usuario.nombre && inicio_contraseña === usuario.contraseña) {
            usuarioEncontrado = true;
            let idUsuarioEncontrado = usuario.id;
            sessionStorage.setItem('id', idUsuarioEncontrado);
            sessionStorage.setItem('isLoggedIn', 'true');
        }
    });
    if (!usuarioEncontrado) {
        alert("Cuenta Incorrecta");
        sessionStorage.setItem('isLoggedIn', 'false');
    }
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
            let productIdd = this.closest(".contenedor-productos").dataset.productId;
            console.log(productIdd);
            agregarAlCarrito(productIdd);
        });
    });
}
async function agregarAlCarrito(productId) {
    let userId = obtenerIdUsuario();
    let producto = await obtenerProductoPorId(productId);
    Toastify({
        text:"Producto Agregado",
        duration:3000,
        close:true,
        gravity:"top",
        position:"right",
        stopOnFocus:true,
        style:{
            background:"linear-gradient(to righ,#4b33a8,#785ce9)",
            borderRadius:"2rem",
            textTransform:"uppercase",
            fontSize:"1.5rem"
        },
        offset: {
            x: "1.5rem",
            y: "1.5rem",
        },
        oneClick: function(){}
    }).showToast();

    if (userId) {
        let usuariosGuardados = localStorage.getItem('usuarios');
        let todosLosUsuarios = JSON.parse(usuariosGuardados);
        let usuarioEncontrado = todosLosUsuarios.find(usuario => usuario.id === userId);

        if (usuarioEncontrado) {
            usuarioEncontrado.carrito.push(producto);
            localStorage.setItem('usuarios', JSON.stringify(todosLosUsuarios));
        } else {
            console.error('Usuario no encontrado');
        }
    } else {
        let carrito_sin_login = JSON.parse(sessionStorage.getItem('carritos')) || [];
        console.log(producto)
        carrito_sin_login.push(producto);
        sessionStorage.setItem('carritos', JSON.stringify(carrito_sin_login));
        console.log(carrito_sin_login);
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



