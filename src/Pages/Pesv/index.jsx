import React from "react";
import Title from "../../Components/title";
import PesvCarousel from "./PesvCarousel";
import imagenFondoPESV from "../../Assets/imagenFondoPESV.png";

export default function PesvPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.35) 0%, rgba(15, 23, 42, 0.45) 100%), url(${imagenFondoPESV})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-9">
            {/* Header */}
            <div
              className="d-flex align-items-start justify-content-between gap-3 mb-3"
              style={{
                background: "rgba(255, 255, 255, 0.92)",
                padding: "16px",
                borderRadius: "12px",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <div>
                <Title item={{ title: "PESV", level: "h1", color: "#1f2937" }} />
                <div className="text-muted" style={{ marginTop: 6 }}>
                  Diligencia los <strong>datos infaltables</strong> del Plan Estratégico de Seguridad Vial.
                  Sin evidencia, no hay cumplimiento. Sin cumplimiento, no hay tranquilidad.
                </div>
              </div>

              <div className="d-none d-md-flex align-items-center gap-2">
                <a
                  href="https://www.asegurar.com.co/"
                  target="_blank"
                  rel="noreferrer"
                  className="badge rounded-pill text-decoration-none"
                  style={{
                    background: "#111827",
                    color: "white",
                    padding: "10px 12px",
                    fontWeight: 800,
                  }}
                  title="Asegurar"
                >
                  Asegurar ↗
                </a>
              </div>
            </div>

            {/* Main card */}
            <div
              className="card border-0 shadow-lg"
              style={{
                borderRadius: 16,
                overflow: "hidden",
                background: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                className="card-body"
                style={{
                  padding: 18,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.72) 50%, rgba(248,249,250,0.65) 100%)",
                  boxShadow: "inset 0px 1px 0px rgba(255,255,255,0.6)",
                }}
              >
                <PesvCarousel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
