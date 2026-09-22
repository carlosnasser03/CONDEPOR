import { renderLayout } from "./layout";

export async function renderHomeView(categoryId: string, categoryName: string): Promise<string> {
  const content = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3rem; flex-wrap: wrap; gap: 1.5rem;">
      <div>
        <div class="badge badge-online" style="margin-bottom: 1rem;">🟢 BROADCAST API ONLINE & CONECTADA</div>
        <h1 style="font-size: 3.2rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 0.6rem; background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          Portal Oficial CONDEPOR
        </h1>
        <p style="font-size: 1.15rem; color: var(--text-muted); max-width: 680px; line-height: 1.6;">
          Plataforma de competiciones juveniles de alto rendimiento. Gestiona plantillas tácticas, actas de partido en tiempo real y estadísticas de jugadores con desempate automático y nomenclatura estándar.
        </p>
      </div>
      <div class="card" style="padding: 1.6rem 2.2rem; border-color: #f59e0b; background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(15, 23, 42, 0.85)); box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
        <div style="font-size: 0.8rem; color: #f59e0b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em;">Torneo Oficial Activo</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #fff; margin-top: 0.3rem;">🏆 ${categoryName}</div>
        <div style="font-size: 0.85rem; color: #38bdf8; margin-top: 0.5rem; font-weight: 600;">ID Torneo: <code style="color: #fff; background: rgba(0,0,0,0.4); padding: 0.2rem 0.5rem; border-radius: 6px;">${categoryId}</code></div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 1.75rem; margin-bottom: 3.5rem;">
      <a href="/api/standings/${categoryId}" style="text-decoration: none; color: inherit;">
        <div class="card" style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; border-color: rgba(245, 158, 11, 0.25);">
          <div>
            <div style="font-size: 2.6rem; margin-bottom: 1rem;">🏆</div>
            <h3 style="font-size: 1.45rem; font-weight: 800; margin-bottom: 0.5rem; color: #fff;">Tabla de Posiciones</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
              Visualiza el ranking general con puntos, diferencia de goles y rendimiento en vivo de los clubes en contienda.
            </p>
          </div>
          <div style="margin-top: 1.75rem; display: flex; align-items: center; gap: 0.5rem; color: #f59e0b; font-weight: 700;">
            Explorar Clasificación &rarr;
          </div>
        </div>
      </a>

      <a href="/api/scorers/${categoryId}/top" style="text-decoration: none; color: inherit;">
        <div class="card" style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; border-color: rgba(56, 189, 248, 0.25);">
          <div>
            <div style="font-size: 2.6rem; margin-bottom: 1rem;">⚽</div>
            <h3 style="font-size: 1.45rem; font-weight: 800; margin-bottom: 0.5rem; color: #fff;">Top Goleadores & Atletas</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
              Ranking de goleadores con puntuación avanzada procesada por el ScoringEngine del campeonato CONDEPOR.
            </p>
          </div>
          <div style="margin-top: 1.75rem; display: flex; align-items: center; gap: 0.5rem; color: #38bdf8; font-weight: 700;">
            Ver Bota de Oro &rarr;
          </div>
        </div>
      </a>

      <a href="/api/matches?categoryId=${categoryId}" style="text-decoration: none; color: inherit;">
        <div class="card" style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; border-color: rgba(16, 185, 129, 0.25);">
          <div>
            <div style="font-size: 2.6rem; margin-bottom: 1rem;">📅</div>
            <h3 style="font-size: 1.45rem; font-weight: 800; margin-bottom: 0.5rem; color: #fff;">Partidos & Actas Oficiales</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
              Consulta encuentros o registra marcadores y el Acta Individual (Goles, Asistencias y Minutos) de cada encuentro en vivo.
            </p>
          </div>
          <div style="margin-top: 1.75rem; display: flex; align-items: center; gap: 0.5rem; color: #10b981; font-weight: 700;">
            Gestionar Actas &rarr;
          </div>
        </div>
      </a>

      <a href="/api/teams?categoryId=${categoryId}" style="text-decoration: none; color: inherit;">
        <div class="card" style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; border-color: rgba(234, 179, 8, 0.3);">
          <div>
            <div style="font-size: 2.6rem; margin-bottom: 1rem;">🛡️</div>
            <h3 style="font-size: 1.45rem; font-weight: 800; margin-bottom: 0.5rem; color: #fff;">Clubes & Plantillas</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
              Explora los clubes participantes, administra plantillas oficiales e inscribe atletas con posiciones estandarizadas.
            </p>
          </div>
          <div style="margin-top: 1.75rem; display: flex; align-items: center; gap: 0.5rem; color: #eab308; font-weight: 700;">
            Administrar Rosters &rarr;
          </div>
        </div>
      </a>

      <a href="/api/health" style="text-decoration: none; color: inherit;">
        <div class="card" style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; border-color: rgba(255, 255, 255, 0.15);">
          <div>
            <div style="font-size: 2.6rem; margin-bottom: 1rem;">❤️</div>
            <h3 style="font-size: 1.45rem; font-weight: 800; margin-bottom: 0.5rem; color: #fff;">Health Check & Diagnóstico</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
              Monitoreo del servidor por capas, reloj del sistema y validación de conectividad de base de datos Prisma.
            </p>
          </div>
          <div style="margin-top: 1.75rem; display: flex; align-items: center; gap: 0.5rem; color: #fff; font-weight: 700;">
            Ver Estado del Servidor &rarr;
          </div>
        </div>
      </a>

      <a href="/admin?categoryId=${categoryId}" style="text-decoration: none; color: inherit;">
        <div class="card" style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; border-color: rgba(168, 85, 247, 0.25); background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(15, 23, 42, 0.85));">
          <div>
            <div style="font-size: 2.6rem; margin-bottom: 1rem;">⚙️</div>
            <h3 style="font-size: 1.45rem; font-weight: 800; margin-bottom: 0.5rem; color: #fff;">Panel de Administración</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
              Crea partidos, registra resultados y agrega jugadores. Todo desde un panel centralizado y fácil de usar.
            </p>
          </div>
          <div style="margin-top: 1.75rem; display: flex; align-items: center; gap: 0.5rem; color: #a855f7; font-weight: 700;">
            Administrar &rarr;
          </div>
        </div>
      </a>
    </div>

    <div class="card" style="background: rgba(16, 185, 129, 0.04); border-color: rgba(16, 185, 129, 0.25); padding: 1.8rem;">
      <div style="display: flex; gap: 1.25rem; align-items: center;">
        <div style="font-size: 2.4rem;">💡</div>
        <div>
          <h4 style="font-size: 1.2rem; font-weight: 800; color: #fff; margin-bottom: 0.3rem;">Estándar de Nomenclatura & Arquitectura Dual</h4>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">
            Todas las posiciones en el campo utilizan la nomenclatura oficial CONDEPOR (<code>POR</code>, <code>DFC</code>, <code>LI</code>, <code>LD</code>, <code>MCD</code>, <code>MC</code>, <code>MCO</code>, <code>EI</code>, <code>ED</code>, <code>DC</code>). Además, la arquitectura dual responde HTML inmersivo en tu navegador o JSON puro al solicitar con la cabecera <code>Accept: application/json</code>.
          </p>
        </div>
      </div>
    </div>
  `;
  return await renderLayout("Dashboard Principal", "home", content, categoryId);
}
