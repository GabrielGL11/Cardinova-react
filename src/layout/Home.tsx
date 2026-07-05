import '../styles/Layout.css'; // Asegúrate de que apunte a tu archivo de estilos
import fondoMedico from "../assets/gestion_medica.png"; 
import publicoObjetivoImg from "../assets/seccion_publico_objetivo.png";

export function Home() {
return (
    <main>
      {/* Sección Inicio */}
    <section id="inicio">
        <div className="contenido-texto">
        <img id="img-fondo-medico" src={fondoMedico} alt="Fondo Médico" className="imagen-fondo" />
        
        <div className="bloque-cabecera">
            <h1 className="titulo-frontal">
                Página para un <br />
                Sistema de Gestión <br />
                Médica
            </h1>
            <a href="/registro" className="boton-inicio botones">Registrarse</a>
            </div>
        </div>

        {/* Sección Problema */}
        <section id="problema" className="seccion-problema">
            <div className="columna-titulo">
            <h2>Problema</h2>
            <p>
                En Manabí, la <strong>baja aceptación tecnológica</strong> en el sector salud se debe a la 
                <strong> falta de difusión y a la preferencia por métodos tradicionales</strong> como llamadas 
                o atención presencial. Además, existe una <strong>fuerte limitación</strong> en la gestión digital
                de recetas, ya que muchas aún se realizan manualmente o <strong>se almacenan en sistemas 
                cerrados sin conectividad</strong>, lo que impide al paciente tener un historial accesible. 
                Esto se agrava en las farmacias, donde la falta de información en tiempo real sobre el stock 
                obliga a los usuarios a recorrer varios lugares, generando <strong>pérdida de tiempo y dinero.</strong>
            </p>
            </div>
            <div className="columna-texto"></div>
        </section>
    </section>

      {/* Sección Público Objetivo */}
    <section className="publico_objetivo">
        <div className="texto-publico">
            <h2>Público Objetivo</h2>
            <p>
            El público objetivo del sistema de gestión médica son los pacientes de Manabí, especialmente los 
            <strong> trabajadores </strong> y <strong>adultos mayores</strong> con <strong>antecedentes de enfermedades cardiovasculares</strong>. 
            Este sistema busca <strong>mejorar la atención médica</strong> al proporcionar una plataforma eficiente y accesible.
            </p>
        </div>
        <div className="imagen-publico">
            <img id="img-publico" src={publicoObjetivoImg} alt="publico objetivo" />
        </div>
    </section>

      {/* Sección Equipo */}
        <section id="equipo">
        <h2>Equipo</h2>
        <div className="miembros">
            <figure>
            <img src="https://picsum.photos/200" alt="Tyrone Anchundia" />
            <figcaption>
                Tyrone Anchundia
                <a href="https://github.com/tyronealan" target="_blank" rel="noopener" aria-label="GitHub">
                <i className="fa-brands fa-github"></i>
                </a>
            </figcaption>
            </figure>
            <figure>
            <img src="https://picsum.photos/200" alt="Anthony Guaman" />
            <figcaption>
                Anthony Guaman
                <a href="https://github.com/GabrielGL11" target="_blank" rel="noopener" aria-label="GitHub">
                <i className="fa-brands fa-github"></i>
                </a>
            </figcaption>
            </figure>
            <figure>
            <img src="https://picsum.photos/200" alt="Adonis Mero" />
            <figcaption>
                Adonis Mero
                <a href="https://github.com/AdonisMer" target="_blank" rel="noopener" aria-label="GitHub">
                <i className="fa-brands fa-github"></i>
                </a>
            </figcaption>
            </figure>
        </div>
        </section>
    </main>
    );
}