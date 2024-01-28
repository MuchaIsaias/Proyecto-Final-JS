
let carrito_sin_login = []

    document.addEventListener('DOMContentLoaded', function () {
        fetch("../js/productos.json")
            .then(response => response.json())
            .then(data => {
                render_Productos(data);
                agregarEventos();
            })
            .catch(error => console.log(error));
    });

function render_Productos(datas) {
    datas.forEach((elm)=>{
        let contenedor_productos=document.querySelector(".todos-los-productos");
        let template_productos=document.querySelector(".template-productos").content.cloneNode(true);
        let id_prodcutos=template_productos.querySelector(".contenedor-productos");
        id_prodcutos.setAttribute('data-product-id', elm.id);
        template_productos.querySelector(".nombre-producto").innerText=elm.nombre;
        template_productos.querySelector(".precio-producto").innerText="$"+elm.precio;
        template_productos.querySelector(".img-productos").src=elm.img;
    
        contenedor_productos.append(template_productos);
    });
    
}

function agregarEventos() {
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
    let userId = obtenerIdUsuario();
    let producto = await obtenerProductoPorId(productId);
    Toastify({
        text:"Producto agregado",
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
            x: "5rem",
            y: "5rem",
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
        let carrito_sin_login =JSON.parse(sessionStorage.getItem('carritos'))
        carrito_sin_login.push(producto);
        sessionStorage.setItem('carritos', JSON.stringify(carrito_sin_login));
        console.log(carrito_sin_login);
    }
}

async function obtenerProductoPorId (idd) {
    try {
        let resp = await fetch ('../js/productos.json');
        let data = await resp.json();
        console.log(data)
        return data.find(producto => producto.id === idd);
    } catch (error) {
        console.log(error)
    }
}