/**
 * Estilos del artículo del blog (tipografía y bloques de contenido).
 * Compartidos entre la página /blog y la vista previa de /utilidades.
 */
const articleStyles = `
  /* Article (post) typography */
  .blog-post-cat {
    display: inline-block; background: #ffd54f; color: #0a2d6e;
    border-radius: 6px; padding: 3px 12px; font-size: 0.72rem; font-weight: 800;
    text-transform: uppercase; letter-spacing: .5px; margin-bottom: 14px;
  }
  .blog-post-title { font-size: clamp(1.5rem,3vw,2.1rem); font-weight: 900; color: var(--accent-dark, #0a2d6e); margin: 0 0 8px; line-height: 1.2; }
  .blog-post-subtitle { font-size: 1.05rem; color: var(--text-secondary, #555); font-style: italic; margin: 0 0 16px; }
  .blog-post-meta {
    display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
    font-size: 0.82rem; color: #8a93a0; padding-bottom: 18px; margin-bottom: 22px;
    border-bottom: 1px solid var(--card-border, #eef1f6);
  }
  .blog-post-meta i { margin-right: 4px; color: #1565c0; }
  .blog-post-dot { color: #ccc; }
  .blog-post-cover { margin: 0 0 24px; border-radius: 14px; overflow: hidden; }
  .blog-post-cover img { width: 100%; display: block; }

  .blog-post-body { font-size: 1rem; color: var(--text-primary, #2b3440); line-height: 1.75; }
  .blog-content-p { margin: 0 0 18px; }
  .blog-content-h4 { font-size: 1.25rem; font-weight: 800; color: var(--accent-dark, #0a2d6e); margin: 28px 0 12px; }
  .blog-content-h5 { font-size: 1.05rem; font-weight: 800; color: var(--accent-dark, #0a2d6e); margin: 22px 0 10px; }
  .blog-content-figure { margin: 22px 0; border-radius: 14px; overflow: hidden; }
  .blog-content-img { width: 100%; display: block; border-radius: 14px; }
  .blog-content-figure figcaption { font-size: 0.82rem; color: #8a93a0; text-align: center; margin-top: 8px; font-style: italic; }

  .blog-content-gallery { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 22px 0; }
  @media (max-width: 576px) { .blog-content-gallery { grid-template-columns: 1fr; } }
  .blog-content-gallery-item { margin: 0; border-radius: 12px; overflow: hidden; }
  .blog-content-gallery-item img { width: 100%; height: 220px; object-fit: cover; display: block; border-radius: 12px; }
  .blog-content-gallery-item figcaption { font-size: 0.78rem; color: #8a93a0; text-align: center; margin-top: 6px; font-style: italic; }

  .blog-content-quote {
    border-left: 4px solid #ffd54f; background: var(--accent-bg, #f0f6ff);
    padding: 18px 22px; border-radius: 0 12px 12px 0; margin: 24px 0;
  }
  .blog-content-quote p { font-size: 1.08rem; font-style: italic; color: var(--accent-dark, #0a2d6e); margin: 0 0 6px; line-height: 1.6; }
  .blog-content-quote cite { font-size: 0.85rem; color: var(--text-secondary, #666); font-style: normal; font-weight: 700; }

  .blog-content-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 14px; margin: 24px 0; }
  .blog-content-stat {
    background: linear-gradient(135deg, #0a2d6e, #1565c0); color: #fff;
    border-radius: 14px; padding: 18px 16px; text-align: center;
  }
  .blog-content-stat .num { display: block; font-size: 1.7rem; font-weight: 900; color: #ffd54f; line-height: 1.1; }
  .blog-content-stat .lbl { display: block; font-size: 0.76rem; color: rgba(255,255,255,0.85); margin-top: 4px; }

  .blog-content-callout {
    display: flex; gap: 12px; align-items: flex-start;
    background: var(--green-bg, #e8f5e9); border: 1px solid var(--green-border, #c8e6c9);
    border-radius: 12px; padding: 16px 18px; margin: 22px 0;
  }
  .blog-content-callout .ic { font-size: 1.3rem; }
  .blog-content-callout p { margin: 0; font-size: 0.95rem; color: var(--text-primary, #2b3440); line-height: 1.6; }

  .blog-content-link { color: #1565c0; font-weight: 700; text-decoration: none; border-bottom: 1.5px solid #bbdefb; }
  .blog-content-link:hover { border-bottom-color: #1565c0; }
  .blog-content-list { margin: 0 0 18px; padding-left: 22px; }
  .blog-content-list li { margin-bottom: 8px; line-height: 1.6; }

  .blog-post-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 26px; padding-top: 18px; border-top: 1px solid var(--card-border, #eef1f6); }
  .blog-post-tag { font-size: 0.78rem; color: #1565c0; background: var(--accent-bg, #e3f0ff); padding: 4px 11px; border-radius: 999px; font-weight: 600; }

`;

export default articleStyles;
