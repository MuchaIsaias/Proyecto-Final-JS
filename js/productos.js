

fetch("/js/productos.json")
    .then(response =>response.json())
    .then(data=>{
        render_Productos(data)
    })
    .catch(error=>console.log(error));



function render_Productos(datas) {
    console.dir(datas)
    let contenedor_productos=document.querySelector(".todos-los-productos");
    datas.forEach((elm)=>{
        let template_productos=document.querySelector(".template-productos").content.cloneNode(true);
        let id_prodcutos=template_productos.querySelector(".contenedor-productos");
        id_prodcutos.setAttribute('data-product-id', elm.id);
        template_productos.querySelector(".nombre-producto").innerText=elm.nombre;
        template_productos.querySelector(".precio-producto").innerText="$"+elm.precio;
        template_productos.querySelector(".img-productos").src=elm.img;
    
        contenedor_productos.append(template_productos);
    });
    
}



