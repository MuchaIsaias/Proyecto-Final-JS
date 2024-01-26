
let formularioBusqueda = document.getElementById('formularioBusqueda');
let buscadorInput = document.getElementById('buscador');
let listaProductos = document.getElementById('listaProductos');

// Función para manejar la búsqueda y actualizar la lista de productos
function manejarBusqueda(event) {
    event.preventDefault()
        let busqueda = buscadorInput.value.toLowerCase();
        fetch("/js/productos.json")
        .then(response =>response.json())
        .then(data=>{
            let productosFiltrados = data.filter(producto =>
            producto.nombre.toLowerCase().includes(busqueda)
        );
        listaProductos.innerHTML = '';
        sessionStorage.setItem('productosFiltrados', JSON.stringify(productosFiltrados));
        window.location.href = 'resultadodebusqueda.html';
        })
}

formularioBusqueda.addEventListener('submit', manejarBusqueda);
