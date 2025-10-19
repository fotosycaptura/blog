// static/js/fondo.js
document.addEventListener("DOMContentLoaded", () => {
  const fondos = [
    "/images/fondo1.jpg",
    "/images/fondo2.jpg",
    "/images/fondo3.jpg",
    "/images/fondo4.jpg",
    "/images/fondo5.jpg",
  ];
    
 // Detectar modo actual
  const tema = localStorage.getItem("pref-theme") ||
               (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    if (tema === "light") {
	const contenido = document.querySelector(".post-content");
	if (contenido) {
	    // Escoge uno al azar
	    const aleatorio = fondos[Math.floor(Math.random() * fondos.length)];
	    // Fondo en mosaico
	    contenido.style.backgroundImage = `url('${aleatorio}')`;
	    contenido.style.backgroundRepeat = "repeat";
	    contenido.style.backgroundAttachment = "scroll"; // o "fixed" si quieres que el patrón no se mueva
	    contenido.style.backgroundPosition = "top left";
	    contenido.style.backgroundColor = "#fff"; // color base detrás del mosaico
	    contenido.style.padding = "2rem";
	    contenido.style.borderRadius = "10px";

    }
  }
});
