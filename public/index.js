const socket = io();
const inputTitulo = document.querySelector("#nombre");
const inputPrecio = document.querySelector("#price");
const inputThumbnail = document.querySelector("#img");

const enviar = document.querySelector("#send");
const listado = document.querySelector("#list");

socket.on("productos", (productos) => {
  console.log(productos);
  listado.innerHTML = productos
    .map((p) => {
      return `Nombre: ${p.title} -  Precio: ${p.price} -  img: ${p.thumbnail}`;
    })
    .join("<br>");
});

enviar.addEventListener("click", () => {
  socket.emit("productoNuevo", {
    title: inputTitulo.value,
    price: inputPrecio.value,
    thumbnail: inputThumbnail.value,
  });
});