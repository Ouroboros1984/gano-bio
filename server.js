'use strict';

const http = require('http');

const PORT = process.env.PORT || 3000;

const HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Gano Digital — Hosting, desarrollo web y soluciones digitales en Colombia." />
  <meta property="og:title" content="Gano Digital" />
  <meta property="og:description" content="Hosting, desarrollo web y soluciones digitales en Colombia." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://gano.bio" />
  <meta name="twitter:card" content="summary" />
  <title>Gano Digital</title>
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      --accent:       #D97E3A;
      --accent-dim:   #b8662d;
      --accent-glow:  rgba(217, 126, 58, 0.18);
      --bg-deep:      #0d0d0f;
      --bg-card:      #141417;
      --bg-btn:       #1c1c21;
      --bg-btn-hover: #24242b;
      --border:       rgba(255, 255, 255, 0.07);
      --text-primary: #f0ede8;
      --text-muted:   #7a7880;
      --text-subtle:  #4a4858;
      --radius-pill:  999px;
      --radius-card:  20px;
      --transition:   200ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    html {
      height: 100%;
      scroll-behavior: smooth;
    }

    body {
      min-height: 100%;
      background-color: var(--bg-deep);
      background-image:
        radial-gradient(ellipse 80% 60% at 50% -10%, rgba(217, 126, 58, 0.12) 0%, transparent 70%),
        radial-gradient(ellipse 50% 40% at 80% 90%, rgba(217, 126, 58, 0.06) 0%, transparent 60%);
      color: var(--text-primary);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                   Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px 16px 56px;
    }

    /* ── Card ── */
    .card {
      width: 100%;
      max-width: 480px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
    }

    /* ── Avatar ── */
    .avatar {
      width: 84px;
      height: 84px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent) 0%, #a85a20 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.4rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: -1px;
      box-shadow:
        0 0 0 3px var(--bg-deep),
        0 0 0 5px rgba(217, 126, 58, 0.35),
        0 8px 32px rgba(217, 126, 58, 0.25);
      flex-shrink: 0;
      /* entrance */
      animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }

    /* ── Header text ── */
    .header {
      text-align: center;
      margin-top: 20px;
      animation: fade-up 0.5s 0.1s ease both;
    }

    .header h1 {
      font-size: 1.65rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: var(--text-primary);
      line-height: 1.1;
    }

    .header h1 span {
      color: var(--accent);
    }

    .header p {
      margin-top: 8px;
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.5;
      max-width: 320px;
      margin-left: auto;
      margin-right: auto;
    }

    /* ── Divider ── */
    .divider {
      width: 40px;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
      border-radius: 2px;
      margin: 24px 0;
      animation: fade-up 0.5s 0.15s ease both;
    }

    /* ── Links list ── */
    .links {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .link-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 15px 22px;
      background: var(--bg-btn);
      border: 1px solid var(--border);
      border-radius: var(--radius-pill);
      color: var(--text-primary);
      text-decoration: none;
      font-size: 0.97rem;
      font-weight: 600;
      letter-spacing: 0.01em;
      transition:
        background var(--transition),
        border-color var(--transition),
        box-shadow var(--transition),
        transform var(--transition);
      position: relative;
      overflow: hidden;
    }

    .link-btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(217, 126, 58, 0.06) 50%,
        transparent 100%
      );
      opacity: 0;
      transition: opacity var(--transition);
    }

    .link-btn:hover {
      background: var(--bg-btn-hover);
      border-color: rgba(217, 126, 58, 0.35);
      box-shadow: 0 4px 24px var(--accent-glow);
      transform: translateY(-2px);
    }

    .link-btn:hover::before {
      opacity: 1;
    }

    .link-btn:active {
      transform: translateY(0px) scale(0.99);
      box-shadow: none;
    }

    /* icon on the left, text center, arrow right */
    .link-btn .btn-icon {
      font-size: 1.15rem;
      width: 28px;
      flex-shrink: 0;
      text-align: left;
    }

    .link-btn .btn-label {
      flex: 1;
      text-align: center;
    }

    .link-btn .btn-arrow {
      width: 28px;
      flex-shrink: 0;
      text-align: right;
      color: var(--accent);
      font-size: 0.85rem;
      opacity: 0;
      transform: translateX(-4px);
      transition: opacity var(--transition), transform var(--transition);
    }

    .link-btn:hover .btn-arrow {
      opacity: 1;
      transform: translateX(0);
    }

    /* Featured button style (first link and CTA) */
    .link-btn.featured {
      background: linear-gradient(135deg, rgba(217, 126, 58, 0.18) 0%, rgba(217, 126, 58, 0.08) 100%);
      border-color: rgba(217, 126, 58, 0.3);
    }

    .link-btn.featured:hover {
      background: linear-gradient(135deg, rgba(217, 126, 58, 0.28) 0%, rgba(217, 126, 58, 0.14) 100%);
      border-color: rgba(217, 126, 58, 0.55);
      box-shadow: 0 6px 32px rgba(217, 126, 58, 0.22);
    }

    /* WhatsApp button */
    .link-btn.whatsapp {
      background: linear-gradient(135deg, rgba(37, 211, 102, 0.12) 0%, rgba(37, 211, 102, 0.05) 100%);
      border-color: rgba(37, 211, 102, 0.2);
    }

    .link-btn.whatsapp .btn-arrow {
      color: #25d366;
    }

    .link-btn.whatsapp:hover {
      background: linear-gradient(135deg, rgba(37, 211, 102, 0.2) 0%, rgba(37, 211, 102, 0.10) 100%);
      border-color: rgba(37, 211, 102, 0.4);
      box-shadow: 0 6px 32px rgba(37, 211, 102, 0.15);
    }

    /* Staggered entrance animations */
    .links .link-btn:nth-child(1)  { animation: fade-up 0.45s 0.20s ease both; }
    .links .link-btn:nth-child(2)  { animation: fade-up 0.45s 0.27s ease both; }
    .links .link-btn:nth-child(3)  { animation: fade-up 0.45s 0.34s ease both; }
    .links .link-btn:nth-child(4)  { animation: fade-up 0.45s 0.41s ease both; }
    .links .link-btn:nth-child(5)  { animation: fade-up 0.45s 0.48s ease both; }
    .links .link-btn:nth-child(6)  { animation: fade-up 0.45s 0.55s ease both; }
    .links .link-btn:nth-child(7)  { animation: fade-up 0.45s 0.62s ease both; }

    /* ── Footer ── */
    .footer {
      margin-top: 40px;
      text-align: center;
      animation: fade-up 0.5s 0.7s ease both;
    }

    .footer p {
      font-size: 0.8rem;
      color: var(--text-subtle);
    }

    .footer p a {
      color: var(--text-muted);
      text-decoration: none;
      transition: color var(--transition);
    }

    .footer p a:hover {
      color: var(--accent);
    }

    .social-links {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-top: 16px;
    }

    .social-links a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--bg-btn);
      border: 1px solid var(--border);
      color: var(--text-muted);
      font-size: 0.85rem;
      text-decoration: none;
      transition:
        background var(--transition),
        border-color var(--transition),
        color var(--transition),
        transform var(--transition);
    }

    .social-links a:hover {
      background: var(--bg-btn-hover);
      border-color: rgba(217, 126, 58, 0.35);
      color: var(--accent);
      transform: translateY(-2px);
    }

    /* ── Keyframes ── */
    @keyframes pop-in {
      from { opacity: 0; transform: scale(0.75); }
      to   { opacity: 1; transform: scale(1); }
    }

    @keyframes fade-up {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── Reduce motion ── */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>
</head>
<body>
  <main class="card" role="main">

    <div class="avatar" aria-hidden="true">GD</div>

    <header class="header">
      <h1>Gano <span>Digital</span></h1>
      <p>Hosting, desarrollo web y soluciones digitales en Colombia</p>
    </header>

    <div class="divider" aria-hidden="true"></div>

    <nav class="links" aria-label="Enlaces de Gano Digital">

      <a class="link-btn featured"
         href="https://app.gano.digital/catalogo"
         target="_blank" rel="noopener noreferrer">
        <span class="btn-icon" aria-hidden="true">🛍️</span>
        <span class="btn-label">Nuestros Servicios</span>
        <span class="btn-arrow" aria-hidden="true">→</span>
      </a>

      <a class="link-btn"
         href="https://app.gano.digital/paquetes"
         target="_blank" rel="noopener noreferrer">
        <span class="btn-icon" aria-hidden="true">💎</span>
        <span class="btn-label">Paquetes y Precios</span>
        <span class="btn-arrow" aria-hidden="true">→</span>
      </a>

      <a class="link-btn featured"
         href="https://calendly.com/kantus16/30min"
         target="_blank" rel="noopener noreferrer">
        <span class="btn-icon" aria-hidden="true">📅</span>
        <span class="btn-label">Agenda una Consulta</span>
        <span class="btn-arrow" aria-hidden="true">→</span>
      </a>

      <a class="link-btn whatsapp"
         href="https://wa.me/573135646123?text=Hola+Gano+Digital"
         target="_blank" rel="noopener noreferrer">
        <span class="btn-icon" aria-hidden="true">💬</span>
        <span class="btn-label">WhatsApp Directo</span>
        <span class="btn-arrow" aria-hidden="true">→</span>
      </a>

      <a class="link-btn"
         href="https://app.gano.digital/portfolio"
         target="_blank" rel="noopener noreferrer">
        <span class="btn-icon" aria-hidden="true">🎨</span>
        <span class="btn-label">Portfolio</span>
        <span class="btn-arrow" aria-hidden="true">→</span>
      </a>

      <a class="link-btn"
         href="https://www.gano.digital"
         target="_blank" rel="noopener noreferrer">
        <span class="btn-icon" aria-hidden="true">🏪</span>
        <span class="btn-label">Catálogo GoDaddy</span>
        <span class="btn-arrow" aria-hidden="true">→</span>
      </a>

      <a class="link-btn"
         href="https://app.gano.digital/investigacion"
         target="_blank" rel="noopener noreferrer">
        <span class="btn-icon" aria-hidden="true">📰</span>
        <span class="btn-label">Investigación y Blog</span>
        <span class="btn-arrow" aria-hidden="true">→</span>
      </a>

    </nav>

    <footer class="footer">
      <p>
        &copy; 2026 Gano Digital &nbsp;&middot;&nbsp;
        <a href="https://gano.digital" target="_blank" rel="noopener noreferrer">gano.digital</a>
      </p>
      <nav class="social-links" aria-label="Redes sociales">
        <a href="https://wa.me/573135646123"
           target="_blank" rel="noopener noreferrer"
           aria-label="WhatsApp">
          <!-- WhatsApp icon (SVG inline) -->
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
        <a href="https://app.gano.digital"
           target="_blank" rel="noopener noreferrer"
           aria-label="Sitio web">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </a>
        <a href="mailto:kantus16@gano.digital"
           aria-label="Email">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </a>
      </nav>
    </footer>

  </main>
</body>
</html>`;

const server = http.createServer((req, res) => {
  // Health check endpoint (useful for GoDaddy / uptime monitors)
  if (req.url === '/health' || req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    return;
  }

  // Serve the page for all other routes
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  });
  res.end(HTML);
});

server.listen(PORT, () => {
  console.log(\`gano-bio running on port \${PORT}\`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});
