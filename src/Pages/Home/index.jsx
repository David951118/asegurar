import React from "react";
import { NavLink } from "react-router-dom";
import jefeFoto from "../../Assets/Equipo Asegurar LTDA/Presidente.jpg";
import getenteFoto from "../../Assets/Equipo Asegurar LTDA/Gerencia.jpg";
import sgsstFoto from "../../Assets/Equipo Asegurar LTDA/SGSST.jpeg";
import equipoFoto1 from "../../Assets/Equipo Asegurar LTDA/oscar.jpeg";
import equipoFoto2 from "../../Assets/Equipo Asegurar LTDA/Ingeniero-David.jpg";
import equipoFoto3 from "../../Assets/Equipo Asegurar LTDA/Asistente.jpg";
import equipoFoto5 from "../../Assets/Equipo Asegurar LTDA/Operador.jpg";
import equipoFoto6 from "../../Assets/Equipo Asegurar LTDA/Operadoa.jpg";
import equipoFoto4 from "../../Assets/Equipo Asegurar LTDA/rojas.jpeg";
import lactiosSantaMaria from "../../Assets/iconsEnter/Lacteos Santa Maria png.png";
import coopsetrans from "../../Assets/iconsEnter/Coopsetrans.png";
import nuevoMilenio from "../../Assets/iconsEnter/Nuevo Milenio.png";
import sammiSaludsas from "../../Assets/iconsEnter/Samy-Salud-png.png";
import heroBg from "../../Assets/Portada 2026/hero-bg.jpg";
import heroBgSm from "../../Assets/Portada 2026/hero-bg-sm.jpg";
import platBg from "../../Assets/Portada 2026/plataformas-bg.jpg";
import platBgSm from "../../Assets/Portada 2026/plataformas-bg-sm.jpg";
import cardCellvi from "../../Assets/Portada 2026/card-cellvi.jpg";
import cardPesv from "../../Assets/Portada 2026/card-pesv.jpg";
import cardRndc from "../../Assets/Portada 2026/card-rndc.jpg";

const styles = `
  /* ── Hero (portada 2026: fondo = parte 01 del diseño) ── */
  .home-hero {
    --hero-yellow: #ffdd0e;
    --hero-navy: #12308a;
    position: relative;
    overflow: hidden;
    font-family: "Montserrat", Roboto, "Segoe UI", sans-serif;
    color: #fff;
    background: #0d3f8f url(${heroBg}) right bottom / cover no-repeat;
    /* La imagen es 2400x1050: con este alto mínimo siempre cubre el
       100% de la altura, así la franja inferior del arte queda alineada
       con la barra de características. */
    min-height: max(600px, calc(100vw * 1050 / 2400));
    display: flex;
    flex-direction: column;
  }
  .hero-inner {
    position: relative;
    z-index: 2;
    flex: 1;
    display: flex;
    align-items: center;
    /* deja libre la franja inferior (14.3% del alto) para la barra */
    padding-block: 32px calc(max(600px, 100vw * 1050 / 2400) * 0.143 + 12px);
  }
  .hero-content { max-width: min(980px, 64vw); }
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    border: 2px solid var(--hero-yellow);
    border-radius: 999px;
    padding: 8px 26px 8px 20px;
    font-size: clamp(0.8rem, 1.05vw, 1rem);
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: clamp(16px, 2vw, 28px);
    background: rgba(10, 35, 100, 0.25);
  }
  .hero-badge i { color: var(--hero-yellow); font-size: 1.2em; }
  .hero-badge .sep { width: 1px; height: 1.2em; background: rgba(255,255,255,0.6); }
  .hero-title {
    font-size: clamp(2.1rem, 3.7vw, 4.4rem);
    font-weight: 800;
    line-height: 1.08;
    letter-spacing: -1px;
    margin: 0 0 clamp(18px, 2vw, 30px);
    color: #fff;
    text-shadow: 0 2px 14px rgba(0,0,0,0.18);
  }
  .hero-title .hl {
    display: block;
    width: fit-content;
    color: var(--hero-yellow);
    font-weight: 900;
    position: relative;
  }
  .hero-title .hl::after {
    content: "";
    position: absolute;
    left: 0.02em;
    bottom: -0.16em;
    width: 1.05em;
    height: 0.11em;
    border-radius: 999px;
    background: var(--hero-yellow);
  }
  .hero-desc {
    font-size: clamp(0.98rem, 1.2vw, 1.2rem);
    color: rgba(255,255,255,0.95);
    line-height: 1.6;
    max-width: 620px;
    margin-bottom: clamp(22px, 2.4vw, 36px);
  }
  .hero-desc strong { font-weight: 800; color: #fff; }
  .hero-cta-group { display: flex; gap: 16px; flex-wrap: wrap; }
  .btn-hero-primary,
  .btn-hero-outline {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 14px 30px;
    border-radius: 999px;
    font-size: clamp(0.95rem, 1.15vw, 1.15rem);
    font-weight: 700;
    text-decoration: none;
    transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  }
  .btn-hero-primary {
    background: var(--hero-yellow);
    color: var(--hero-navy);
    border: 2px solid var(--hero-yellow);
  }
  .btn-hero-primary:hover {
    color: var(--hero-navy);
    transform: translateY(-2px);
    box-shadow: 0 10px 26px rgba(0,0,0,0.28);
  }
  .btn-hero-outline {
    background: rgba(10, 35, 100, 0.2);
    color: #fff;
    border: 2px solid #fff;
  }
  .btn-hero-outline:hover {
    color: #fff;
    background: rgba(255,255,255,0.14);
    transform: translateY(-2px);
  }
  .btn-hero-primary .pi-angle-right,
  .btn-hero-outline .pi-angle-right { font-size: 1.1em; margin-left: 4px; }

  /* Barra de características: se superpone a la franja azul del arte
     (85.7% → 99.1% del alto de la imagen). */
  .hero-features {
    position: absolute;
    z-index: 2;
    left: 0;
    right: 0;
    top: 85.7%;
    bottom: 0.9%;
    display: flex;
    align-items: center;
  }
  .hero-features-grid {
    display: grid;
    grid-template-columns: repeat(4, auto);
    justify-content: start;
    align-items: center;
    width: 100%;
    max-width: 72%;
  }
  .hero-feature {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0 clamp(14px, 2.2vw, 40px);
    border-left: 1px solid rgba(255,255,255,0.45);
  }
  .hero-feature:first-child { border-left: none; padding-left: 0; }
  .hero-feature-icon {
    width: clamp(40px, 3.6vw, 64px);
    height: clamp(40px, 3.6vw, 64px);
    flex-shrink: 0;
    border-radius: 50%;
    border: 2px solid var(--hero-yellow);
    color: var(--hero-yellow);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: clamp(1.1rem, 1.7vw, 1.8rem);
  }
  .hero-feature-text {
    font-size: clamp(0.8rem, 1.05vw, 1.05rem);
    line-height: 1.3;
    color: #fff;
  }
  .hero-feature-text { white-space: nowrap; }
  .hero-feature-text strong { display: block; font-weight: 700; }

  .hero-desc { text-shadow: 0 1px 8px rgba(8,30,90,0.45); }
  @media (max-width: 1279.98px) {
    .home-hero::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background: linear-gradient(90deg, rgba(13,52,130,0.7) 0%, rgba(13,52,130,0.45) 45%, transparent 70%);
    }
  }
  @media (max-width: 991.98px) {
    .home-hero { min-height: 0; background-image: url(${heroBgSm}); background-position: 72% bottom; }
    .home-hero::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      background: linear-gradient(90deg, rgba(13,52,130,0.96) 0%, rgba(13,52,130,0.82) 55%, rgba(13,52,130,0.35) 100%);
    }
    .hero-inner { padding-block: 48px 36px; }
    .hero-content { max-width: 100%; }
    .hero-features {
      position: relative;
      top: auto;
      bottom: auto;
      background: rgba(10, 38, 110, 0.92);
      border-top: 3px solid var(--hero-yellow);
      padding-block: 20px;
    }
    .hero-features-grid {
      max-width: 100%;
      grid-template-columns: repeat(2, 1fr);
      row-gap: 18px;
    }
    .hero-feature,
    .hero-feature:first-child { border-left: none; padding: 0 8px; }
    .hero-feature-text { white-space: normal; }
  }
  @media (max-width: 420px) {
    .hero-badge { gap: 10px; padding: 6px 16px; }
    .btn-hero-primary, .btn-hero-outline { width: 100%; justify-content: center; }
  }

  /* ── Plataformas (diseño 2026: fondo = parte 2-05 del diseño) ── */
  .plat-section {
    --plat-yellow: #ffdd0e;
    --plat-navy: #12308a;
    --plat-blue: #1a5aa8;
    position: relative;
    overflow: hidden;
    font-family: "Montserrat", Roboto, "Segoe UI", sans-serif;
    background: var(--plat-blue);
    color: #fff;
  }

  /* Franja de cifras */
  .plat-stats {
    position: relative;
    z-index: 3;
    background: linear-gradient(180deg, #fff 0%, #eef3fa 100%);
    box-shadow: 0 6px 24px rgba(8, 30, 90, 0.18);
  }
  .plat-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: center;
    padding-block: clamp(16px, 1.8vw, 26px);
  }
  .plat-stat {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(12px, 1.2vw, 20px);
    padding: 4px 12px;
    border-left: 2px solid #d4dbe6;
  }
  .plat-stat:first-child { border-left: none; }
  .plat-stat-icon i,
  .plat-card-icon i,
  .rndc2-icon > i,
  .rndc2-icon-badge i { font-size: inherit; }
  .plat-stat-icon {
    width: clamp(48px, 4.4vw, 70px);
    height: clamp(48px, 4.4vw, 70px);
    flex-shrink: 0;
    border-radius: 50%;
    background: linear-gradient(145deg, #2a63c4 0%, #12308a 100%);
    box-shadow: 0 4px 12px rgba(18, 48, 138, 0.35);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: clamp(1.2rem, 1.8vw, 1.8rem);
  }
  .plat-stat-number {
    font-size: clamp(1.5rem, 2.4vw, 2.4rem);
    font-weight: 900;
    color: var(--plat-navy);
    line-height: 1;
    letter-spacing: -0.5px;
  }
  .plat-stat-label {
    margin-top: 4px;
    font-size: clamp(0.66rem, 0.85vw, 0.85rem);
    font-weight: 600;
    color: #4a5568;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    white-space: nowrap;
  }

  /* Escena con vehículos */
  .plat-scene {
    position: relative;
    background: url(${platBg}) center bottom / cover no-repeat;
    /* La imagen es 2400x696 */
    min-height: max(420px, calc(100vw * 696 / 2400));
  }
  .plat-scene::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 22%;
    background: linear-gradient(180deg, rgba(26,90,168,0) 0%, var(--plat-blue) 100%);
    pointer-events: none;
  }
  .plat-intro {
    position: relative;
    z-index: 2;
    padding-top: clamp(28px, 4.6vw, 80px);
    max-width: min(900px, 56vw);
  }
  .plat-tag {
    display: inline-block;
    border: 2px solid var(--plat-yellow);
    border-radius: 999px;
    padding: 8px 30px;
    font-size: clamp(0.8rem, 1.05vw, 1.05rem);
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    background: rgba(10, 35, 100, 0.22);
    margin-bottom: clamp(14px, 2vw, 30px);
  }
  .plat-title {
    font-size: clamp(1.6rem, 2.9vw, 3.3rem);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -0.5px;
    margin: 0 0 clamp(10px, 1.2vw, 18px);
    color: #fff;
    text-shadow: 0 2px 14px rgba(8, 30, 90, 0.35);
  }
  .plat-title .nw { white-space: nowrap; }
  .plat-title .hl {
    display: block;
    color: var(--plat-yellow);
    font-size: 1.7em;
    line-height: 1;
  }
  .plat-desc {
    font-size: clamp(0.95rem, 1.2vw, 1.2rem);
    line-height: 1.45;
    max-width: 470px;
    margin: 0;
    color: rgba(255,255,255,0.96);
    text-shadow: 0 1px 8px rgba(8, 30, 90, 0.55);
  }
  .plat-desc-line {
    display: block;
    width: 74px;
    height: 8px;
    margin-top: clamp(14px, 1.6vw, 26px);
    border-radius: 999px;
    background: var(--plat-yellow);
  }

  /* Tarjetas */
  .plat-cards {
    position: relative;
    z-index: 2;
    margin-top: calc(-1 * clamp(10px, 1.5vw, 28px));
    padding-bottom: clamp(48px, 5vw, 80px);
  }
  .plat-cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(16px, 2vw, 32px);
  }
  .plat-card {
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 18px;
    background: linear-gradient(180deg, rgba(40,110,200,0.92) 0%, rgba(22,80,160,0.96) 100%);
    border: 1.5px solid rgba(140, 200, 255, 0.7);
    box-shadow: 0 0 18px rgba(90, 180, 255, 0.35), inset 0 0 24px rgba(120, 190, 255, 0.18);
    padding: 14px 14px 0;
    color: #fff;
    text-decoration: none;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .plat-card:hover {
    color: #fff;
    transform: translateY(-6px);
    box-shadow: 0 0 28px rgba(110, 195, 255, 0.6), inset 0 0 24px rgba(120, 190, 255, 0.22);
  }
  .plat-card-head {
    display: flex;
    align-items: stretch;
    gap: 12px;
  }
  .plat-card-icon {
    width: clamp(64px, 5.4vw, 86px);
    flex-shrink: 0;
    align-self: center;
    aspect-ratio: 1;
    border-radius: 16px;
    background: linear-gradient(145deg, rgba(110,175,245,0.55) 0%, rgba(30,95,185,0.75) 100%);
    border: 1px solid rgba(190, 225, 255, 0.6);
    box-shadow: 0 4px 14px rgba(5, 30, 90, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: clamp(1.7rem, 2.6vw, 2.5rem);
  }
  .plat-card-img {
    flex: 1;
    min-width: 0;
    border-radius: 10px;
    object-fit: cover;
    width: 100%;
    aspect-ratio: 800 / 243;
    -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 22%);
            mask-image: linear-gradient(90deg, transparent 0%, #000 22%);
  }
  .plat-card-body {
    flex: 1;
    padding: clamp(14px, 1.6vw, 22px) clamp(10px, 1.6vw, 26px) 0;
  }
  .plat-card h3 {
    font-size: clamp(1.05rem, 1.35vw, 1.35rem);
    font-weight: 800;
    line-height: 1.25;
    margin: 0 0 12px;
    color: #fff;
  }
  .plat-card h3 span { color: var(--plat-yellow); }
  .plat-card p {
    font-size: clamp(0.88rem, 0.98vw, 0.98rem);
    line-height: 1.5;
    color: rgba(255,255,255,0.92);
    margin: 0;
  }
  .plat-card-btn {
    align-self: center;
    display: inline-flex;
    align-items: center;
    gap: 14px;
    margin: 20px 0 -20px;
    padding: 9px 30px;
    border-radius: 999px;
    background: var(--plat-yellow);
    color: var(--plat-navy);
    font-size: clamp(0.9rem, 1.05vw, 1.05rem);
    font-weight: 800;
    box-shadow: 0 6px 16px rgba(5, 25, 80, 0.35);
    white-space: nowrap;
  }
  .plat-card-btn i { font-size: 0.85em; }
  .plat-corner {
    position: absolute;
    right: -40px;
    bottom: -10px;
    width: 140px;
    height: 120px;
    background: var(--plat-yellow);
    clip-path: polygon(62% 0, 100% 0, 100% 100%, 0 100%);
    z-index: 1;
    pointer-events: none;
  }

  @media (max-width: 1199.98px) {
    .plat-scene::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      background: linear-gradient(90deg, rgba(13,52,130,0.75) 0%, rgba(13,52,130,0.4) 50%, transparent 72%);
    }
    .plat-intro { max-width: min(620px, 60vw); }
  }
  @media (max-width: 991.98px) {
    .plat-stats-grid { grid-template-columns: repeat(2, 1fr); row-gap: 18px; }
    .plat-stat { justify-content: flex-start; }
    .plat-stat:nth-child(3) { border-left: none; }
    .plat-scene { background-image: url(${platBgSm}); background-position: 70% bottom; min-height: 480px; }
    .plat-intro { max-width: 100%; }
    .plat-title .nw { white-space: normal; }
    .plat-cards-grid { grid-template-columns: 1fr; max-width: 620px; margin: 0 auto; gap: 44px; }
    .plat-cards { margin-top: -30px; }
  }
  @media (max-width: 575.98px) {
    .plat-stats-grid { column-gap: 8px; }
    .plat-stat { border-left: none; padding: 4px 0; gap: 10px; }
    .plat-stat-icon { width: 42px; height: 42px; font-size: 1.1rem; }
    .plat-stat-label { white-space: normal; }
    .plat-scene { min-height: 440px; }
    .plat-scene::before { background: linear-gradient(180deg, rgba(13,52,130,0.85) 0%, rgba(13,52,130,0.55) 55%, rgba(13,52,130,0.1) 80%); }
    .plat-card-btn { padding-inline: 22px; }
  }

  /* Bloques de títulos reutilizados por Equipo y Clientes */
  .section-tag {
    display: inline-block;
    background: #e3f0ff;
    color: #1565c0;
    border-radius: 999px;
    padding: 5px 16px;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  .section-title {
    font-size: clamp(1.8rem, 3.5vw, 2.6rem);
    font-weight: 900;
    color: #0a2d6e;
    margin-bottom: 14px;
    line-height: 1.2;
  }
  .section-sub {
    color: #666;
    font-size: 1.05rem;
    max-width: 560px;
    margin: 0 auto 48px;
    line-height: 1.7;
  }

  /* ── RNDC integrado (diseño 2026) ── */
  .rndc2-section {
    --plat-yellow: #ffdd0e;
    --plat-navy: #12308a;
    position: relative;
    overflow: hidden;
    font-family: "Montserrat", Roboto, "Segoe UI", sans-serif;
    padding: clamp(40px, 4.5vw, 72px) 0 clamp(48px, 5vw, 80px);
    background:
      linear-gradient(180deg, rgba(240,247,255,0.84) 0%, rgba(240,247,255,0.93) 45%, #f0f6ff 100%),
      url(${platBg}) center top / cover no-repeat;
    color: #1d2b4f;
  }
  .rndc2-head { text-align: center; margin-bottom: clamp(26px, 3vw, 44px); }
  .rndc2-tag {
    display: inline-flex;
    align-items: center;
    gap: clamp(14px, 2vw, 30px);
    margin-bottom: clamp(14px, 1.6vw, 22px);
  }
  .rndc2-tag::before,
  .rndc2-tag::after {
    content: "";
    width: clamp(36px, 4.5vw, 72px);
    height: 4px;
    border-radius: 999px;
    background: var(--plat-yellow);
  }
  .rndc2-tag span {
    background: linear-gradient(180deg, #1d4aa8 0%, #12308a 100%);
    color: #fff;
    border-radius: 999px;
    padding: 9px clamp(18px, 2vw, 30px);
    font-size: clamp(0.82rem, 1.1vw, 1.1rem);
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    box-shadow: 0 4px 14px rgba(18, 48, 138, 0.3);
  }
  .rndc2-title {
    font-size: clamp(1.9rem, 3.6vw, 3.6rem);
    font-weight: 900;
    color: var(--plat-navy);
    letter-spacing: -1px;
    line-height: 1.1;
    margin: 0 0 clamp(12px, 1.4vw, 20px);
  }
  .rndc2-title .hl {
    display: inline-block;
    background: var(--plat-yellow);
    border-radius: 12px;
    padding: 0 0.2em 0.06em;
    color: var(--plat-navy);
  }
  .rndc2-sub {
    max-width: 680px;
    margin: 0 auto;
    font-size: clamp(0.98rem, 1.25vw, 1.25rem);
    line-height: 1.5;
    color: #26375f;
  }
  .rndc2-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: clamp(16px, 2vw, 30px);
  }
  .rndc2-card {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    background: rgba(255,255,255,0.86);
    border: 1px solid rgba(255,255,255,0.95);
    box-shadow: 0 12px 34px rgba(18, 60, 140, 0.16);
    backdrop-filter: blur(6px);
    padding: clamp(20px, 2vw, 30px);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .rndc2-card::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 48%;
    height: 4px;
    background: linear-gradient(90deg, var(--plat-yellow), rgba(255,221,14,0));
  }
  .rndc2-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 40px rgba(18, 60, 140, 0.22);
  }
  .rndc2-card-head {
    display: flex;
    align-items: flex-start;
    gap: clamp(14px, 1.6vw, 22px);
    margin-bottom: 18px;
  }
  .rndc2-icon {
    position: relative;
    width: clamp(64px, 6vw, 96px);
    aspect-ratio: 1;
    flex-shrink: 0;
    border-radius: 18px;
    background: linear-gradient(145deg, #2f72d6 0%, #12308a 100%);
    box-shadow: 0 6px 16px rgba(18, 48, 138, 0.35);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: clamp(1.7rem, 2.6vw, 2.6rem);
  }
  .rndc2-icon-badge {
    position: absolute;
    right: -6px;
    bottom: -6px;
    width: 42%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: var(--plat-yellow);
    color: var(--plat-navy);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.42em;
    font-weight: 900;
    border: 3px solid #fff;
  }
  .rndc2-card h3 {
    font-size: clamp(1.2rem, 1.75vw, 1.75rem);
    font-weight: 900;
    color: var(--plat-navy);
    line-height: 1.2;
    margin: 0 0 8px;
  }
  .rndc2-card h3 span { color: #f2b600; }
  .rndc2-card-head p {
    margin: 0;
    font-size: clamp(0.88rem, 0.98vw, 0.98rem);
    line-height: 1.55;
    color: #2b3a5e;
  }
  .rndc2-body {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .rndc2-steps {
    position: relative;
    z-index: 1;
    list-style: none;
    padding: 0;
    margin: 0 0 22px;
    max-width: 58%;
  }
  .rndc2-steps li {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 12px;
    font-size: clamp(0.88rem, 0.98vw, 0.98rem);
    color: #23345d;
  }
  .rndc2-steps strong { color: var(--plat-navy); font-weight: 800; }
  .rndc2-step-num {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    border-radius: 50%;
    background: var(--plat-yellow);
    color: var(--plat-navy);
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 3px 8px rgba(200, 160, 0, 0.35);
  }
  .rndc2-btn {
    position: relative;
    z-index: 1;
    margin-top: auto;
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 14px;
    padding: 13px 34px 13px 28px;
    border-radius: 999px;
    background: var(--plat-yellow);
    color: var(--plat-navy);
    font-size: clamp(0.98rem, 1.2vw, 1.2rem);
    font-weight: 800;
    text-decoration: none;
    box-shadow: 0 6px 18px rgba(200, 160, 0, 0.35);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .rndc2-btn:hover {
    color: var(--plat-navy);
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(200, 160, 0, 0.45);
  }
  .rndc2-photo {
    position: absolute;
    top: 0;
    right: calc(-1 * clamp(20px, 2vw, 30px));
    width: 50%;
    height: calc(100% + clamp(20px, 2vw, 30px));
    object-fit: cover;
    object-position: 70% center;
    border-top-left-radius: 24px;
    -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 38%), linear-gradient(180deg, transparent 0%, #000 22%);
    -webkit-mask-composite: source-in;
            mask-image: linear-gradient(90deg, transparent 0%, #000 38%), linear-gradient(180deg, transparent 0%, #000 22%);
            mask-composite: intersect;
  }
  .rndc2-note {
    display: flex;
    align-items: center;
    gap: clamp(14px, 2vw, 26px);
    margin-top: clamp(22px, 2.6vw, 36px);
    padding: clamp(14px, 1.6vw, 22px) clamp(18px, 2vw, 30px);
    border-radius: 16px;
    background: rgba(255,255,255,0.9);
    border-left: 6px solid var(--plat-yellow);
    box-shadow: 0 8px 26px rgba(18, 60, 140, 0.12);
  }
  .rndc2-note-icon {
    width: clamp(48px, 4.2vw, 64px);
    aspect-ratio: 1;
    flex-shrink: 0;
    border-radius: 50%;
    background: var(--plat-navy);
    border: 4px solid var(--plat-yellow);
    color: var(--plat-yellow);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: clamp(1.3rem, 1.8vw, 1.8rem);
    font-weight: 900;
    font-family: Georgia, serif;
  }
  .rndc2-note p {
    margin: 0;
    font-size: clamp(0.88rem, 0.98vw, 0.98rem);
    line-height: 1.6;
    color: #2b3a5e;
  }
  .rndc2-note strong {
    color: var(--plat-navy);
    font-size: 1.12em;
    font-weight: 800;
    padding-right: 12px;
    margin-right: 12px;
    border-right: 2px solid #9aa8c3;
  }
  .rndc2-note a { color: #1d4aa8; font-weight: 800; }
  @media (max-width: 991.98px) {
    .rndc2-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 575.98px) {
    .rndc2-tag::before, .rndc2-tag::after { display: none; }
    .rndc2-card-head { flex-direction: column; }
    .rndc2-steps { max-width: 100%; }
    .rndc2-photo { display: none; }
    .rndc2-btn { align-self: stretch; justify-content: center; }
    .rndc2-note { flex-direction: column; align-items: flex-start; }
    .rndc2-note strong { display: block; border-right: none; padding-right: 0; margin-bottom: 4px; }
  }

  /* Modo oscuro */
  [data-theme="dark"] .plat-stats { background: var(--card-bg, #1b2433); }
  [data-theme="dark"] .plat-stat { border-left-color: rgba(255,255,255,0.15); }
  [data-theme="dark"] .plat-stat-number { color: #ffd54f; }
  [data-theme="dark"] .plat-stat-label { color: var(--text-secondary, #b4bfd0); }
  [data-theme="dark"] .rndc2-section {
    background:
      linear-gradient(180deg, rgba(12,22,42,0.88) 0%, rgba(12,22,42,0.94) 45%, #0c162a 100%),
      url(${platBg}) center top / cover no-repeat;
    color: var(--text-primary, #e6ecf5);
  }
  [data-theme="dark"] .rndc2-title,
  [data-theme="dark"] .rndc2-card h3,
  [data-theme="dark"] .rndc2-steps strong,
  [data-theme="dark"] .rndc2-note strong { color: #fff; }
  [data-theme="dark"] .rndc2-sub,
  [data-theme="dark"] .rndc2-card-head p,
  [data-theme="dark"] .rndc2-steps li,
  [data-theme="dark"] .rndc2-note p { color: var(--text-secondary, #b4bfd0); }
  [data-theme="dark"] .rndc2-card,
  [data-theme="dark"] .rndc2-note {
    background: rgba(27, 36, 51, 0.9);
    border-color: rgba(255,255,255,0.08);
  }
  [data-theme="dark"] .rndc2-note a { color: #ffd54f; }

  /* ── Equipo ── */
  .team-section {
    padding: 80px 0;
    background: #fff;
  }
  .team-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  @media (max-width: 992px) { .team-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 576px) { .team-grid { grid-template-columns: 1fr; } }
  .team-card {
    position: relative;
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e8eef5;
    padding: 28px 20px 22px;
    text-align: center;
    transition: all 0.35s ease;
    overflow: hidden;
  }
  .team-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(21,101,192,0.12);
    border-color: #bbdefb;
  }
  .team-avatar-wrap {
    width: 100px;
    height: 100px;
    margin: 0 auto 16px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #e3f0ff;
    transition: border-color 0.3s;
  }
  .team-card:hover .team-avatar-wrap { border-color: #1565c0; }
  .team-avatar-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s;
  }
  .team-card:hover .team-avatar-wrap img { transform: scale(1.08); }
  .team-name {
    font-size: 1rem;
    font-weight: 800;
    color: #0a2d6e;
    margin: 0 0 4px;
    line-height: 1.3;
  }
  .team-role {
    font-size: 0.82rem;
    font-weight: 600;
    color: #1565c0;
    background: #e3f0ff;
    display: inline-block;
    padding: 3px 12px;
    border-radius: 999px;
    margin-bottom: 10px;
  }
  .team-desc {
    font-size: 0.85rem;
    color: #666;
    line-height: 1.55;
    margin: 0 0 12px;
  }
  .team-email {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.82rem;
    color: #1565c0;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
  }
  .team-email:hover { color: #0a2d6e; }

  /* ── Clientes ── */
  .clients-section {
    padding: 60px 0;
    background: #f8fafc;
  }
  .client-logo-card {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 20px;
    background: #fff;
    border-radius: 12px;
    border: 1px solid #e8eef5;
    transition: all 0.3s ease;
    height: 100px;
  }
  .client-logo-card:hover {
    box-shadow: 0 8px 24px rgba(21,101,192,0.12);
    border-color: #bbdefb;
    transform: translateY(-3px);
  }
  .client-logo-card img {
    max-height: 55px;
    max-width: 130px;
    object-fit: contain;
    filter: grayscale(30%);
    transition: filter 0.3s;
  }
  .client-logo-card:hover img { filter: grayscale(0%); }
`;

const heroFeatures = [
  { icon: "pi-map-marker", title: "Ubicación", sub: "en tiempo real" },
  { icon: "pi-phone", title: "Teléfono", sub: "y soporte 24/7" },
  { icon: "pi-shield", title: "Mayor", sub: "seguridad" },
  { icon: "pi-sliders-h", title: "Control", sub: "total de su flota" },
];

const empleados = [
  {
    name: "Rómulo Exmeling Bolaños Escobar",
    cargo: "Presidente",
    email: "romulo.bolanose@gmail.com",
    foto: jefeFoto,
    descript: "Administrador de Empresas, Profesional en Ciencias Militares. Asesor en Seguridad.",
  },
  {
    name: "Deyanira López Solarte",
    cargo: "Gerente General",
    email: "asegurar.limitada@gmail.com",
    foto: getenteFoto,
    descript: "Administradora de Empresas, 20 años de experiencia en manejo de personal y finanzas.",
  },
  {
    name: "Valentina Ledesma Marin",
    cargo: "Responsable SG-SST",
    email: "sstvalentina8@gmail.com",
    foto: sgsstFoto,
    descript: "Profesional en administración en seguridad y salud en el trabajo y auditora HSEQ.",
  },
  {
    name: "Oscar Mauricio Arteaga Rodriguez",
    cargo: "Administrador Plataforma de Monitoreo CELLVI",
    email: "jefatura.red.asegurar@gmail.com",
    foto: equipoFoto1,
    descript: "Ingeniero de Sistemas egresado de la universidad CESMAG. Administrador de la plataforma CELLVI.",
  },
  {
    name: "David Sebastian Montes Zarama",
    cargo: "Jefe de Desarrollos Tecnológicos",
    email: "dsmontes95@gmail.com",
    foto: equipoFoto2,
    descript: "Ingeniero Electronico de la Universidad de Nariño. Desarrollador FullStack.",
  },
  {
    name: "Johanna Yamile Guzmán Gaviria",
    cargo: "Asistente de Gerencia",
    email: "asistenteasegurar@gmail.com",
    foto: equipoFoto3,
    descript: "Secretaria ejecutiva, especialista en manejo de paquetes contables SIIGO.",
  },
  {
    name: "Jose Rafael Agreda España",
    cargo: "Operador de Medios Tecnológicos",
    email: "centralmasegurar@gmail.com",
    foto: equipoFoto5,
    descript: "Tecnologo en sistemas, especializados en manejo y control de flotas.",
  },
  {
    name: "Sandra Patricia Cuchala Andrade",
    cargo: "Operadora de Medios Tecnólogicos",
    email: "centralmasegurar@gmail.com",
    foto: equipoFoto6,
    descript: "Tecnologo en sistemas, especializados en manejo y control de flotas.",
  },
  {
    name: "Johanna Maribell Rojas Pastas",
    cargo: "Operadora de Medios Tecnólogicos",
    email: "centralmasegurar@gmail.com",
    foto: equipoFoto4,
    descript: "Tecnologo en sistemas, especializados en manejo y control de flotas.",
  },
];

const platStats = [
  { icon: "pi-user", number: "25+", label: "Años de experiencia" },
  { icon: "pi-desktop", number: "24/7", label: "Central de monitoreo" },
  { icon: "pi-shield", number: "100%", label: "Cobertura nacional" },
  { icon: "pi-cloud", number: "CELLVI", label: "Plataforma propia" },
];

const platCards = [
  {
    to: "/cellvi",
    icon: "pi-map-marker",
    img: cardCellvi,
    sigla: "CELLVI",
    nombre: "Monitoreo Vehicular",
    desc: "Central Especializada de Logística y Localización Vehicular Internacional. Rastree su flota en tiempo real, 24/7, desde cualquier dispositivo.",
    cta: "Ingresar a CELLVI",
  },
  {
    to: "/pesv",
    icon: "pi-verified",
    img: cardPesv,
    sigla: "PESV",
    nombre: "Plan Estratégico de Seguridad Vial",
    desc: "Gestione su Plan Estratégico de Seguridad Vial. Cumpla con la normativa colombiana y registre sus formularios preoperativos de manera digital.",
    cta: "Ir al PESV",
  },
  {
    to: "/rndc",
    icon: "pi-truck",
    img: cardRndc,
    sigla: "RNDC",
    nombre: "Registro Nacional de Despacho de Carga",
    desc: "Portal integrado para la gestión de manifiestos de carga (preoperativas) y creación de contratos FUEC. Todo desde un mismo acceso.",
    cta: "Ingresar al RNDC",
  },
];

const rndcModulos = [
  {
    numero: 1,
    icon: "pi-file-edit",
    badge: "pi-plus",
    img: cardPesv,
    nombre: "Preoperativas y Manifiestos",
    desc: "Registro y seguimiento de manifiestos de carga (preoperativas) antes de cada despacho. Gestione, consulte y elimine manifiestos desde nuestra plataforma conectada al sistema RNDC.",
    pasos: [
      "Ingrese con sus credenciales CELLVI al portal RNDC",
      <>Seleccione la pestaña <strong>Manifiestos</strong></>,
      "Consulte, registre o actualice sus preoperativas",
    ],
  },
  {
    numero: 2,
    icon: "pi-file",
    badge: "pi-truck",
    img: cardCellvi,
    nombre: "Contratos FUEC",
    desc: "El Formato Único de Extracto de Contrato (FUEC) es el documento obligatorio para el transporte especial. Desde nuestro portal puede crear y gestionar sus contratos FUEC de manera ágil.",
    pasos: [
      "Ingrese al portal RNDC con sus credenciales",
      <>Seleccione la pestaña <strong>Contratos FUEC</strong></>,
      "Complete los datos y genere su contrato en PDF",
    ],
  },
];

const aliados = [
  { src: lactiosSantaMaria, title: "Lacteos Santa Maria", link: "https://lacteossantamaria.com/" },
  { src: coopsetrans, title: "Coopsetrans", link: "https://coopsetrans.org/" },
  { src: nuevoMilenio, title: "Transportes Nuevo Milenio", link: "https://www.facebook.com/TRANSPORTESTNM/" },
  { src: sammiSaludsas, title: "IPS SamySalud SAS", link: "https://www.facebook.com/OficialSamySaludSas" },
];

export default function Home() {
  return (
    <>
      <style>{styles}</style>

      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="hero-inner">
          <div className="container">
            <div className="hero-content">
              <span className="hero-badge">
                <i className="pi pi-map-marker" />
                Asegurar Ltda.
                <span className="sep" />
                Pasto, Nariño
              </span>
              <h1 className="hero-title">
                Tecnología al servicio de <span className="hl">la seguridad vial</span>
              </h1>
              <p className="hero-desc">
                Somos una empresa nariñense con más de 25 años de trayectoria en
                telecomunicaciones y monitoreo vehicular. Nuestra plataforma{" "}
                <strong>CELLVI</strong> opera <strong>24/7</strong> para mantener
                su flota conectada y segura.
              </p>
              <div className="hero-cta-group">
                <NavLink to="/contacto" className="btn-hero-primary">
                  <i className="pi pi-envelope" />
                  Contáctenos
                  <i className="pi pi-angle-right" />
                </NavLink>
                <NavLink to="/cellvi" className="btn-hero-outline">
                  <i className="pi pi-map-marker" />
                  Rastrea tu activo
                  <i className="pi pi-angle-right" />
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-features">
          <div className="container">
            <div className="hero-features-grid">
              {heroFeatures.map((f) => (
                <div key={f.title} className="hero-feature">
                  <span className="hero-feature-icon"><i className={`pi ${f.icon}`} /></span>
                  <span className="hero-feature-text">
                    <strong>{f.title}</strong>
                    {f.sub}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PLATAFORMAS (cifras + tarjetas) ── */}
      <section className="plat-section">
        <div className="plat-stats">
          <div className="container">
            <div className="plat-stats-grid">
              {platStats.map((s) => (
                <div key={s.number} className="plat-stat">
                  <span className="plat-stat-icon"><i className={`pi ${s.icon}`} /></span>
                  <div>
                    <div className="plat-stat-number">{s.number}</div>
                    <div className="plat-stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="plat-scene">
          <div className="container">
            <div className="plat-intro">
              <span className="plat-tag">Nuestras plataformas</span>
              <h2 className="plat-title">
                <span className="nw">Soluciones integrales para el</span>{" "}
                <span className="hl">transporte</span>
              </h2>
              <p className="plat-desc">
                Acceda a nuestros tres sistemas especializados desde un solo lugar.
              </p>
              <span className="plat-desc-line" />
            </div>
          </div>
        </div>

        <div className="plat-cards">
          <div className="container">
            <div className="plat-cards-grid">
              {platCards.map((c) => (
                <NavLink key={c.to} to={c.to} className="plat-card">
                  <div className="plat-card-head">
                    <span className="plat-card-icon"><i className={`pi ${c.icon}`} /></span>
                    <img className="plat-card-img" src={c.img} alt="" />
                  </div>
                  <div className="plat-card-body">
                    <h3>{c.sigla} - <span>{c.nombre}</span></h3>
                    <p>{c.desc}</p>
                  </div>
                  <span className="plat-card-btn">
                    {c.cta} <i className="pi pi-angle-double-right" />
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
        <span className="plat-corner" />
      </section>

      {/* ── RNDC INTEGRACIÓN INFO ── */}
      <section className="rndc2-section">
        <div className="container">
          <div className="rndc2-head">
            <div className="rndc2-tag"><span>Sistema RNDC integrado</span></div>
            <h2 className="rndc2-title">
              Dos módulos, <span className="hl">un solo ingreso</span>
            </h2>
            <p className="rndc2-sub">
              Nuestro portal RNDC integra los dos procesos que exige el sistema
              nacional de carga en Colombia.
            </p>
          </div>

          <div className="rndc2-grid">
            {rndcModulos.map((m) => (
              <div key={m.numero} className="rndc2-card">
                <div className="rndc2-card-head">
                  <span className="rndc2-icon">
                    <i className={`pi ${m.icon}`} />
                    <span className="rndc2-icon-badge"><i className={`pi ${m.badge}`} /></span>
                  </span>
                  <div>
                    <h3>Módulo {m.numero} – <span>{m.nombre}</span></h3>
                    <p>{m.desc}</p>
                  </div>
                </div>
                <div className="rndc2-body">
                  <img className="rndc2-photo" src={m.img} alt="" />
                  <ol className="rndc2-steps">
                    {m.pasos.map((p, i) => (
                      <li key={i}>
                        <span className="rndc2-step-num">{i + 1}</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ol>
                  <NavLink to="/rndc" className="rndc2-btn">
                    <i className="pi pi-arrow-right" /> Acceder al módulo
                  </NavLink>
                </div>
              </div>
            ))}
          </div>

          <div className="rndc2-note">
            <span className="rndc2-note-icon">i</span>
            <p>
              <strong>¿Cómo funciona la integración?</strong>
              Ambos módulos comparten el mismo login con sus credenciales CELLVI.
              No necesita cuentas separadas: un solo usuario y contraseña le da
              acceso a preoperativas y contratos FUEC dentro del portal RNDC de
              Asegurar. Si aún no tiene credenciales,{" "}
              <NavLink to="/contacto">contáctenos</NavLink> para registrarse.
            </p>
          </div>
        </div>
      </section>

      {/* ── EQUIPO ── */}
      <section className="team-section">
        <div className="container">
          <div className="text-center mb-2">
            <span className="section-tag" style={{background:"#e3f0ff", color:"#1565c0"}}>Nuestro equipo</span>
          </div>
          <h2 className="section-title text-center">
            Profesionales comprometidos con su seguridad
          </h2>
          <p className="section-sub text-center">
            Un selecto equipo de profesionales de la información y las
            comunicaciones genera altos estándares de calidad en el servicio AVL.
          </p>
          <div className="team-grid">
            {empleados.map((emp, i) => (
              <div key={i} className="team-card">
                <div className="team-avatar-wrap">
                  <img src={emp.foto} alt={emp.name} />
                </div>
                <h3 className="team-name">{emp.name}</h3>
                <span className="team-role">{emp.cargo}</span>
                <p className="team-desc">{emp.descript}</p>
                <a href={`mailto:${emp.email}`} className="team-email" target="_blank" rel="noopener noreferrer">
                  <i className="pi pi-envelope" />
                  {emp.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENTES ── */}
      <section className="clients-section">
        <div className="container">
          <div className="text-center mb-4">
            <span className="section-tag" style={{background:"#e3f0ff", color:"#1565c0"}}>Clientes</span>
            <h2 className="section-title">Algunos de nuestros aliados</h2>
          </div>
          <div className="row g-3 justify-content-center align-items-center">
            {aliados.map((item, i) => (
              <div key={i} className="col-6 col-md-3">
                <a href={item.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                  <div className="client-logo-card">
                    <img src={item.src} alt={item.title} />
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
