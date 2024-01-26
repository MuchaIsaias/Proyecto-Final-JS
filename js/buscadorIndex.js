

let formularioBusqueda3 = document.getElementById('formularioBusqueda');
let buscadorInput3 = document.getElementById('buscador');
let listaProductos3 = document.getElementById('listaProductos');

formularioBusqueda3.addEventListener('submit',(evt)=>{
    evt.preventDefault()
    let busqueda3 = buscadorInput3.value.toLowerCase();

    fetch("/js/productos.json")
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


fetch("/js/productos.json")
    .then(response =>response.json())
    .then(data=>{
        render_Productos2(data)
    })
    .catch(error=>console.log(error));


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




