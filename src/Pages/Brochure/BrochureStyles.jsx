import React from "react";

export default function BrochureStyles({ watermark }) {
  return (
    <style>{`
      @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700&family=Playfair+Display:wght@500;600&display=swap");

      :root {
        --brochure-blue-900: #0f2a4f;
        --brochure-blue-700: #1f5aa6;
        --brochure-blue-500: #2f7bd6;
        --brochure-sky-200: #cfe2ff;
        --brochure-amber-100: #fff3cc;
        --brochure-amber-200: #ffe2a1;
        --brochure-ink: #0f172a;
        --brochure-muted: #5b6b7d;
        --brochure-card: rgba(255, 255, 255, 0.92);
        --brochure-border: rgba(148, 163, 184, 0.25);
        --brochure-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
      }

      .brochure {
        min-height: 100vh;
        color: var(--brochure-ink);
        font-family: "Manrope", "Segoe UI", Arial, sans-serif, "Segoe UI Emoji",
          "Apple Color Emoji", "Noto Color Emoji";
        background: linear-gradient(180deg, #f6f9ff 0%, #edf4ff 40%, #dde9ff 100%);
        position: relative;
        overflow: hidden;
      }

      .brochure::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: url("${watermark}");
        background-repeat: repeat;
        background-size: 420px;
        opacity: 0.06;
        pointer-events: none;
      }

      .brochure::after {
        content: "";
        position: absolute;
        inset: -20% 0 0 0;
        background: radial-gradient(circle at 10% 10%, rgba(47, 123, 214, 0.18), transparent 50%),
          radial-gradient(circle at 90% 0%, rgba(255, 226, 161, 0.22), transparent 45%);
        pointer-events: none;
      }

      .brochure__topbar {
        position: sticky;
        top: 0;
        z-index: 20;
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.85);
        border-bottom: 1px solid var(--brochure-sky-200);
      }

      .brochure__topbar-inner {
        max-width: 1080px;
        margin: 0 auto;
        padding: 20px 16px 16px;
      }

      .brochure__topbar-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }

      .brochure__title {
        font-weight: 700;
        font-size: 16px;
        color: var(--brochure-blue-900);
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .brochure__title-sub {
        font-size: 12px;
        color: var(--brochure-muted);
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .brochure__actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .brochure__search {
        min-width: 220px;
        padding: 10px 16px;
        border-radius: 999px;
        border: 1px solid var(--brochure-sky-200);
        background: #fff;
        font-size: 13px;
        outline: none;
        transition: box-shadow 0.2s ease, border-color 0.2s ease;
      }

      .brochure__search:focus {
        border-color: var(--brochure-blue-500);
        box-shadow: 0 0 0 3px rgba(47, 123, 214, 0.15);
      }

      .brochure__print {
        border: 1px solid var(--brochure-amber-200);
        background: var(--brochure-amber-100);
        color: #6b4b00;
        padding: 10px 18px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .brochure__print:hover {
        transform: translateY(-1px);
        box-shadow: 0 8px 20px rgba(255, 209, 102, 0.25);
      }

      .brochure__nav {
        margin-top: 14px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .brochure__chip {
        border-radius: 999px;
        border: 1px solid var(--brochure-sky-200);
        background: rgba(255, 255, 255, 0.8);
        padding: 8px 14px;
        font-size: 12px;
        font-weight: 600;
        color: var(--brochure-blue-700);
        cursor: pointer;
        transition: background 0.2s ease, transform 0.2s ease;
      }

      .brochure__chip:hover {
        background: #fff;
        transform: translateY(-1px);
      }

      .brochure__main {
        max-width: 1080px;
        margin: 0 auto;
        padding: 28px 16px 60px;
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .brochure__section {
        background: var(--brochure-card);
        border: 1px solid var(--brochure-border);
        border-radius: 28px;
        padding: 24px;
        box-shadow: var(--brochure-shadow);
        position: relative;
        max-width: 100%;
        box-sizing: border-box;
      }

      .brochure__hero {
        padding: 28px;
      }

      .brochure__hero-row {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        justify-content: space-between;
        gap: 20px;
      }

      .brochure__eyebrow {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.3em;
        color: var(--brochure-blue-500);
        font-weight: 700;
      }

      .brochure__h1 {
        margin-top: 10px;
        font-family: "Playfair Display", "Times New Roman", serif;
        font-size: clamp(26px, 4vw, 38px);
        color: var(--brochure-blue-900);
      }

      .brochure__sub {
        margin-top: 12px;
        max-width: 600px;
        color: var(--brochure-muted);
        line-height: 1.6;
      }

      .brochure__stats {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .brochure__stat {
        padding: 12px 16px;
        border-radius: 18px;
        border: 1px solid var(--brochure-border);
        background: #fff;
        min-width: 120px;
        text-align: center;
      }

      .brochure__stat--ok {
        background: rgba(47, 123, 214, 0.08);
        border-color: rgba(47, 123, 214, 0.2);
      }

      .brochure__stat--warn {
        background: rgba(255, 226, 161, 0.45);
        border-color: rgba(255, 190, 90, 0.45);
      }

      .brochure__stat-label {
        font-size: 11px;
        color: var(--brochure-muted);
      }

      .brochure__stat-value {
        font-size: 14px;
        font-weight: 700;
        color: var(--brochure-blue-900);
      }

      .brochure__metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 12px;
        margin-top: 16px;
      }

      .brochure__metric {
        background: #fff;
        border-radius: 18px;
        border: 1px solid var(--brochure-border);
        padding: 16px;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
      }

      .brochure__metric-label {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: var(--brochure-muted);
      }

      .brochure__metric-value {
        margin-top: 6px;
        font-size: 18px;
        font-weight: 700;
        color: var(--brochure-blue-900);
      }

      .brochure__notes {
        margin-top: 16px;
        display: grid;
        gap: 12px;
      }

      .brochure__note {
        border-left: 4px solid transparent;
        border-radius: 18px;
        padding: 14px 16px;
        background: rgba(15, 23, 42, 0.04);
        line-height: 1.6;
      }

      .brochure__note--info {
        border-left-color: #7dd3fc;
        background: rgba(125, 211, 252, 0.14);
      }

      .brochure__note--ok {
        border-left-color: #34d399;
        background: rgba(52, 211, 153, 0.12);
      }

      .brochure__note--warn {
        border-left-color: #fbbf24;
        background: rgba(251, 191, 36, 0.16);
      }

      .brochure__note--bad {
        border-left-color: #f87171;
        background: rgba(248, 113, 113, 0.14);
      }

      .brochure__section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .brochure__h2 {
        font-size: 20px;
        color: var(--brochure-blue-900);
        font-weight: 700;
      }

      .brochure__tag {
        font-size: 11px;
        color: var(--brochure-muted);
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .brochure__text {
        margin-top: 8px;
        color: var(--brochure-muted);
        line-height: 1.6;
      }

      .brochure__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
        margin-top: 16px;
      }

      .brochure__grid > * {
        min-width: 0;
      }

      .brochure__card {
        border-radius: 20px;
        border: 1px solid var(--brochure-border);
        background: #fff;
        padding: 18px;
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
        max-width: 100%;
        box-sizing: border-box;
        min-width: 0;
        overflow: hidden;
      }

      .brochure__h3 {
        font-size: 16px;
        font-weight: 700;
        color: var(--brochure-blue-900);
        margin-bottom: 8px;
      }

      .brochure__list {
        margin: 8px 0 0 18px;
        color: var(--brochure-muted);
        display: grid;
        gap: 6px;
      }

      .brochure__list--compact {
        margin-top: 12px;
      }

      .brochure__stack {
        margin-top: 16px;
        display: grid;
        gap: 16px;
      }

      .brochure__mono {
        font-size: 11px;
        color: var(--brochure-muted);
        font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
      }

      .brochure__inline-code {
        font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
        background: rgba(15, 23, 42, 0.06);
        padding: 2px 6px;
        border-radius: 6px;
        font-size: 12px;
      }

      .brochure__codewrap {
        position: relative;
        max-width: 100%;
        min-width: 0;
      }

      .brochure__code {
        font-size: 12px;
        line-height: 1.6;
        font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
        background: #0b1b33;
        color: #e2e8f0;
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 16px;
        padding: 16px;
        overflow: auto;
        white-space: pre;
        max-width: 100%;
        width: 100%;
        box-sizing: border-box;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      .brochure__copy {
        position: absolute;
        top: 12px;
        right: 12px;
        border-radius: 999px;
        border: 1px solid rgba(148, 163, 184, 0.4);
        background: rgba(15, 23, 42, 0.8);
        color: #e2e8f0;
        font-size: 11px;
        padding: 6px 10px;
        cursor: pointer;
        transition: transform 0.2s ease;
      }

      .brochure__copy:hover {
        transform: translateY(-1px);
      }

      .brochure__mark {
        background: rgba(255, 215, 115, 0.6);
        color: #6b4b00;
        padding: 0 4px;
        border-radius: 6px;
      }

      .brochure__role {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        border: 1px solid var(--brochure-sky-200);
        background: rgba(255, 255, 255, 0.8);
        color: var(--brochure-blue-700);
      }

      .brochure__role-switch {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-top: 10px;
      }

      .brochure__role-btn {
        border-radius: 999px;
        border: 1px solid var(--brochure-sky-200);
        background: rgba(255, 255, 255, 0.8);
        padding: 8px 14px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--brochure-blue-700);
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .brochure__role-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 8px 18px rgba(47, 123, 214, 0.18);
      }

      .brochure__role-btn--active {
        border-color: rgba(47, 123, 214, 0.4);
        background: rgba(47, 123, 214, 0.12);
        color: var(--brochure-blue-900);
      }

      .brochure__footer {
        border-top: 1px solid var(--brochure-sky-200);
        padding-top: 20px;
        font-size: 12px;
        color: var(--brochure-muted);
      }

      .print-hidden {
        print-color-adjust: exact;
      }

      @media (max-width: 768px) {
        .brochure__topbar-inner {
          padding: 16px;
        }

        .brochure__hero {
          padding: 22px;
        }

        .brochure__stats {
          width: 100%;
        }

        .brochure__code {
          white-space: pre-wrap;
          word-break: break-word;
        }
      }

      @media print {
        .print-hidden {
          display: none;
        }

        .brochure {
          background: #fff;
        }

        .brochure::before,
        .brochure::after {
          display: none;
        }
      }
    `}</style>
  );
}
