

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



