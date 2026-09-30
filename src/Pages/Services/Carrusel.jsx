// Páginas del portafolio vigente (PDF "Portafolio ASEGURAR LTDA DEF.",
// septiembre 2026) exportadas a JPG. Para actualizarlo basta con reemplazar
// los archivos de la carpeta: se cargan en orden por nombre.
const paginasCtx = require.context("../../Assets/Portafolio 2026", false, /\.jpg$/);
const paginas = paginasCtx.keys().sort().map((k) => paginasCtx(k));

export default function Carrusel() {
  const items = paginas.map((foto) => ({ foto }));

  return (
    <div className="container">
      <div
        id="carouselExample"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="50000"
      >
        <div className="carousel-inner">
          {items.map((item, index) => (
            <div
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              key={index}
            >
              <img
                src={item.foto}
                className="d-block w-100 rounded"
                alt={`Portafolio Asegurar Ltda. - página ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
