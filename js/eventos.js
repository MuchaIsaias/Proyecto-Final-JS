


let isLoggedIn = sessionStorage.getItem('isLoggedIn');
let carrito_sin_login_guardado = JSON.parse(sessionStorage.getItem('carritos'))


if (isLoggedIn==="true") {
    let totalPrecio=0
    let id_iniciado = obtenerIdUsuario()
    let usuariosGuardados = localStorage.getItem('usuarios');
    let todosLosUsuarios = JSON.parse(usuariosGuardados);
    console.log(todosLosUsuarios)
    let usuarioEncontrado = todosLosUsuarios.find(usuario => usuario.id === id_iniciado);
    console.log(usuarioEncontrado)
    usuarioEncontrado.carrito.forEach((elm)=>{
        let template_productos_carrito=document.querySelector(".template-productos-carrito").content.cloneNode(true);
        let id_prodcutos_carrito=template_productos_carrito.querySelector(".contenedor-productos-carrito");
        let contenedor_productos_carrito=document.querySelector(".conteiner_carrito");
        id_prodcutos_carrito.setAttribute('data-product-id', elm.id);
        template_productos_carrito.querySelector(".nombre-producto").innerText=elm.nombre;
        template_productos_carrito.querySelector(".precio-producto").innerText="$"+elm.precio;
        let rutaOriginal = elm.img;
        let nuevaRuta = rutaOriginal.replace(/^(.\/|..\/)/, "../");
        template_productos_carrito.querySelector(".img-productos").src = nuevaRuta;
        contenedor_productos_carrito.append(template_productos_carrito);
        let {precio}=elm
        let template_productos_precio=document.querySelector(".template-productos-precio").content.cloneNode(true);
        let conteiner_precios=document.querySelector(".resultados-carrito")
        template_productos_precio.querySelector(".precios").innerText=precio 
        conteiner_precios.append(template_productos_precio)
        totalPrecio += precio
    });
    let template_productos_total=document.querySelector(".template-productos-total").content.cloneNode(true);
    let conteiner_precios=document.querySelector(".resultados-carrito")
        template_productos_total.querySelector(".total-precio").innerText=totalPrecio
        conteiner_precios.append(template_productos_total)
}else{
    let totalPrecio=0
    carrito_sin_login_guardado.forEach((elm)=>{
        let template_productos_carrito=document.querySelector(".template-productos-carrito").content.cloneNode(true);
        let id_prodcutos_carrito=template_productos_carrito.querySelector(".contenedor-productos-carrito");
        let contenedor_productos_carrito=document.querySelector(".conteiner_carrito");
        id_prodcutos_carrito.setAttribute('data-product-id', elm.id);
        template_productos_carrito.querySelector(".nombre-producto").innerText=elm.nombre;
        template_productos_carrito.querySelector(".precio-producto").innerText="$"+elm.precio;
        let rutaOriginal = elm.img;
        let nuevaRuta = rutaOriginal.replace(/^(.\/|..\/)/, "../");
        template_productos_carrito.querySelector(".img-productos").src = nuevaRuta;
        contenedor_productos_carrito.append(template_productos_carrito);
        let { precio } = elm;
        let template_productos_precio=document.querySelector(".template-productos-precio").content.cloneNode(true);
        let conteiner_precios=document.querySelector(".resultados-carrito")
        template_productos_precio.querySelector(".precios").innerText=precio 
        conteiner_precios.append(template_productos_precio)
        totalPrecio += precio
    })
    let template_productos_total=document.querySelector(".template-productos-total").content.cloneNode(true);
    let conteiner_precios=document.querySelector(".resultados-carrito")
        template_productos_total.querySelector(".total-precio").innerText=totalPrecio
        conteiner_precios.append(template_productos_total)
}