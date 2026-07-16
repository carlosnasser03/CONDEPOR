import { getPrismaClient } from "@infrastructure/persistence/prisma/PrismaClient";

export async function getNavbarCategories(): Promise<Array<{ id: string; name: string; color?: string }>> {
  try {
    const prisma = getPrismaClient();
    return await prisma.category.findMany();
  } catch (e) {
    return [];
  }
}

export async function renderLayout(
  title: string,
  activeTab: string,
  content: string,
  categoryId: string = "",
  categoriesList?: Array<{ id: string; name: string }>
): Promise<string> {
  const cats = categoriesList || (await getNavbarCategories());
  const currentCat = cats.find((c) => c.id === categoryId) || cats[2] || cats[0] || { id: categoryId, name: "Fútbol Infantil U-12" };
  const activeId = currentCat.id;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | CONDEPOR - DeporteHN</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #040711;
      --card-bg: rgba(15, 23, 42, 0.82);
      --card-hover: rgba(22, 33, 58, 0.92);
      --border: rgba(255, 255, 255, 0.12);
      --primary: #f59e0b;
      --primary-glow: rgba(245, 158, 11, 0.38);
      --secondary: #38bdf8;
      --accent: #10b981;
      --accent-glow: rgba(16, 185, 129, 0.35);
      --warning: #eab308;
      --danger: #ef4444;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Outfit', sans-serif; }
    body {
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-image: radial-gradient(circle at 15% 15%, rgba(245, 158, 11, 0.12) 0%, transparent 42%),
                        radial-gradient(circle at 85% 85%, rgba(56, 189, 248, 0.1) 0%, transparent 42%),
                        radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 60%);
      background-attachment: fixed;
    }
    .navbar {
      background: rgba(8, 12, 22, 0.88);
      backdrop-filter: blur(24px);
      border-bottom: 1px solid var(--border);
      padding: 1rem 2.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    }
    .logo {
      font-size: 1.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #f59e0b 0%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      letter-spacing: -0.02em;
    }
    .category-selector {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 0.45rem 1rem;
      gap: 0.6rem;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
    }
    .category-selector span {
      font-size: 0.75rem;
      color: #f59e0b;
      font-weight: 800;
      letter-spacing: 0.06em;
    }
    .category-selector select {
      background: transparent;
      color: #fff;
      font-weight: 700;
      font-size: 0.95rem;
      border: none;
      outline: none;
      cursor: pointer;
      padding-right: 0.5rem;
    }
    .category-selector select option {
      background: #0f172a;
      color: #fff;
      padding: 0.5rem;
    }
    .nav-links {
      display: flex;
      gap: 1.2rem;
      list-style: none;
      align-items: center;
      flex-wrap: wrap;
    }
    .nav-link {
      color: var(--text-muted);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.25s ease;
      padding: 0.55rem 0.95rem;
      border-radius: 10px;
    }
    .nav-link:hover, .nav-link.active {
      color: #fff;
      background: rgba(255, 255, 255, 0.07);
    }
    .nav-link.active {
      color: var(--primary);
      font-weight: 700;
      border: 1px solid rgba(245, 158, 11, 0.4);
      background: rgba(245, 158, 11, 0.1);
      box-shadow: 0 0 15px rgba(245, 158, 11, 0.15);
    }
    .main-content {
      flex: 1;
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      padding: 3rem 2rem;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 2rem;
      backdrop-filter: blur(16px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.6);
    }
    .card:hover {
      transform: translateY(-4px);
      background: var(--card-hover);
      border-color: rgba(245, 158, 11, 0.45);
      box-shadow: 0 25px 50px -12px rgba(245, 158, 11, 0.25);
    }
    .table-container {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0,0,0,0.6);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th {
      background: rgba(255, 255, 255, 0.04);
      padding: 1.25rem 1.5rem;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      border-bottom: 1px solid var(--border);
    }
    td {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 0.95rem;
      color: var(--text);
    }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: rgba(255, 255, 255, 0.03); }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .badge-primary { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.35); }
    .badge-success { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.35); }
    .badge-warning { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.35); }
    .badge-danger { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.35); }
    .badge-online {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.35);
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.25);
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 14px;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.25s ease;
      text-decoration: none;
      border: none;
    }
    .btn-primary {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #fff;
      box-shadow: 0 8px 20px -6px var(--primary-glow);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px -4px var(--primary-glow);
    }
    .btn-outline {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text);
      border: 1px solid var(--border);
    }
    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: #f59e0b;
    }
    
    footer {
      border-top: 1px solid var(--border);
      padding: 2.5rem;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.9rem;
      background: rgba(8, 12, 22, 0.7);
    }
  </style>
</head>
<body>
  <nav class="navbar">
    <div style="display: flex; align-items: center; gap: 1.5rem;">
      <a href="/" class="logo">⚽ CONDEPOR</a>
      <div class="category-selector">
        <span>TORNEO OFICIAL:</span>
        <select onchange="window.location.href = this.value">
          ${cats
            .map((c) => {
              let targetUrl = `/api/standings/${c.id}`;
              if (activeTab === "scorers") targetUrl = `/api/scorers/${c.id}/top`;
              else if (activeTab === "matches") targetUrl = `/api/matches?categoryId=${c.id}`;
              else if (activeTab === "teams") targetUrl = `/api/teams?categoryId=${c.id}`;
              else if (activeTab === "home" || activeTab === "health") targetUrl = `/?categoryId=${c.id}`;
              return `<option value="${targetUrl}" ${c.id === activeId ? "selected" : ""}>🏆 ${c.name}</option>`;
            })
            .join("")}
        </select>
      </div>
    </div>
    <ul class="nav-links">
      <li><a href="/?categoryId=${activeId}" class="nav-link ${activeTab === "home" ? "active" : ""}">🏠 Inicio</a></li>
      <li><a href="/api/standings/${activeId}" class="nav-link ${activeTab === "standings" ? "active" : ""}">🏆 Tabla de Posiciones</a></li>
      <li><a href="/api/scorers/${activeId}/top" class="nav-link ${activeTab === "scorers" ? "active" : ""}">⚽ Goleadores</a></li>
      <li><a href="/api/matches?categoryId=${activeId}" class="nav-link ${activeTab === "matches" ? "active" : ""}">📅 Partidos</a></li>
      <li><a href="/api/teams?categoryId=${activeId}" class="nav-link ${activeTab === "teams" ? "active" : ""}">🛡️ Clubes & Plantillas</a></li>
      <li><a href="/api/health" class="nav-link ${activeTab === "health" ? "active" : ""}">❤️ Estado API</a></li>
    </ul>
  </nav>

  <main class="main-content">
    ${content}
  </main>

  <footer>
    DeporteHN • CONDEPOR Oficial • 6 Categorías Juveniles • 48 Clubes & 720 Atletas • Arquitectura por Capas & SOLID
  </footer>
</body>
</html>`;
}

export function isBrowserRequest(req: any): boolean {
  const accept = req.headers["accept"] || "";
  const userAgent = req.headers["user-agent"] || "";
  if (req.xhr || accept.includes("application/json") || userAgent.includes("curl") || userAgent.includes("Postman")) {
    return false;
  }
  return accept.includes("text/html");
}
