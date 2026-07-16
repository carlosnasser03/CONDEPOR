import { renderLayout } from "./layout";

const POSITION_MAP: Record<string, { code: string; label: string; badgeColor: string }> = {
  "DELANTERO": { code: "DC", label: "Delantero Centro", badgeColor: "#f43f5e" },
  "MEDIOCAMPISTA": { code: "MC", label: "Mediocentro / Mixto", badgeColor: "#10b981" },
  "DEFENSA": { code: "DFC", label: "Defensa Central", badgeColor: "#38bdf8" },
  "PORTERO": { code: "POR", label: "Guardameta / Portero", badgeColor: "#eab308" },
  "POR": { code: "POR", label: "Guardameta / Portero", badgeColor: "#eab308" },
  "DFC": { code: "DFC", label: "Defensa Central", badgeColor: "#38bdf8" },
  "LI": { code: "LI", label: "Lateral Izquierdo", badgeColor: "#0ea5e9" },
  "LD": { code: "LD", label: "Lateral Derecho", badgeColor: "#0ea5e9" },
  "MCD": { code: "MCD", label: "Mediocentro Defensivo", badgeColor: "#14b8a6" },
  "MC": { code: "MC", label: "Mediocentro Central", badgeColor: "#10b981" },
  "MCO": { code: "MCO", label: "Mediocentro Ofensivo", badgeColor: "#84cc16" },
  "EI": { code: "EI", label: "Extremo Izquierdo", badgeColor: "#f97316" },
  "ED": { code: "ED", label: "Extremo Derecho", badgeColor: "#f97316" },
  "DC": { code: "DC", label: "Delantero Centro", badgeColor: "#f43f5e" }
};

export async function renderScorersView(scorers: any[], categoryId: string): Promise<string> {
  const cardsHtml = scorers.map((item, idx) => {
    let medal = `#${item.position || idx + 1}`;
    if (idx === 0) medal = `🥇 BOTA DE ORO (#1)`;
    else if (idx === 1) medal = `🥈 BOTA DE PLATA (#2)`;
    else if (idx === 2) medal = `🥉 BOTA DE BRONCE (#3)`;

    const posInfo = POSITION_MAP[item.position?.toUpperCase()] || { code: item.position || "DC", label: item.position || "Delantero Centro", badgeColor: "#f43f5e" };
    const goals = item.goals || item.seasonGoals || 0;
    const points = item.points || item.seasonPoints || 0;
    const jerseyNumber = item.jerseyNumber || "10";

    return `
      <div class="card" style="display: flex; align-items: center; justify-content: space-between; padding: 1.6rem 2.2rem; border: 1px solid ${idx === 0 ? 'rgba(245, 158, 11, 0.45)' : 'var(--border)'}; background: ${idx === 0 ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(15, 23, 42, 0.85))' : 'var(--card-bg)'}; position: relative; overflow: hidden;">
        ${idx === 0 ? `<div style="position: absolute; top: -30px; right: 150px; width: 120px; height: 120px; background: radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%); pointer-events: none;"></div>` : ''}

        <div style="display: flex; align-items: center; gap: 1.75rem;">
          <div style="font-size: 1.1rem; font-weight: 800; min-width: 140px; color: ${idx === 0 ? '#f59e0b' : (idx === 1 ? '#cbd5e1' : (idx === 2 ? '#d97706' : 'var(--text-muted)'))}; letter-spacing: -0.01em;">
            ${medal}
          </div>

          <div style="width: 60px; height: 60px; border-radius: 16px; background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(56, 189, 248, 0.2)); border: 2px solid ${idx === 0 ? '#f59e0b' : '#38bdf8'}; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 800; color: #fff; font-family: monospace; box-shadow: 0 4px 15px rgba(0,0,0,0.4);">
            #${jerseyNumber}
          </div>

          <div>
            <h3 style="font-size: 1.45rem; font-weight: 800; color: #fff; letter-spacing: -0.02em;">${item.playerName || item.name}</h3>
            <div style="display: flex; align-items: center; gap: 0.8rem; margin-top: 0.4rem; flex-wrap: wrap;">
              <span class="badge" style="background: rgba(255,255,255,0.06); color: #fff; border: 1px solid var(--border); font-size: 0.8rem;">
                🛡️ ${item.teamName || (item.team ? item.team.name : 'Club Oficial')}
              </span>
              <span style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.3rem 0.75rem; border-radius: 20px; font-weight: 700; font-size: 0.75rem; background: ${posInfo.badgeColor}22; color: ${posInfo.badgeColor}; border: 1px solid ${posInfo.badgeColor}55;">
                <span style="width: 6px; height: 6px; border-radius: 50%; background: ${posInfo.badgeColor};"></span>
                ${posInfo.code} - ${posInfo.label}
              </span>
            </div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 3.5rem;">
          <div style="text-align: right;">
            <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 0.05em;">Goles Acumulados</div>
            <div style="font-size: 2.2rem; font-weight: 800; color: #10b981; font-family: monospace;">⚽ ${goals}</div>
          </div>
          <div style="text-align: right; min-width: 140px; background: rgba(245, 158, 11, 0.12); padding: 0.75rem 1.4rem; border-radius: 18px; border: 1px solid rgba(245, 158, 11, 0.35); box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
            <div style="font-size: 0.75rem; text-transform: uppercase; color: #f59e0b; font-weight: 800; letter-spacing: 0.06em;">Puntos Scoring</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #fff; font-family: monospace;">⭐ ${points}</div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  const content = `
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <div class="badge badge-primary" style="margin-bottom: 0.75rem;">⚽ ESTADÍSTICAS INDIVIDUALES DE RENDIMIENTO</div>
        <h1 style="font-size: 2.6rem; font-weight: 800; color: #fff; letter-spacing: -0.03em;">Top Goleadores & Atletas</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; margin-top: 0.25rem; max-width: 680px; line-height: 1.5;">
          Ranking oficial procesado en vivo por <code>ScoringEngine</code> y la constante <code>SCORING_RULES</code> (Goles=10pts, Asistencias=3pts, CleanSheet=5pts).
        </p>
      </div>
      <a href="/api/scorers/${categoryId}/top" onclick="fetchAndShowJson(event, '/api/scorers/${categoryId}/top')" class="btn btn-outline">
        <span>📄 Ver JSON RAW</span>
      </a>
    </div>

    <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 3rem;">
      ${cardsHtml || `<div class="card" style="text-align: center; padding: 4rem; color: var(--text-muted);">No se han registrado goles o estadísticas en las actas de esta categoría aún.</div>`}
    </div>

    <script>
      function fetchAndShowJson(e, url) {
        e.preventDefault();
        fetch(url, { headers: { 'Accept': 'application/json' } })
          .then(r => r.json())
          .then(data => {
            const win = window.open('', '_blank');
            win.document.write('<pre style="background: #0b0f19; color: #34d399; padding: 2rem; font-family: monospace; font-size: 14px;">' + JSON.stringify(data, null, 2) + '</pre>');
          });
      }
    </script>
  `;
  return await renderLayout("Top Goleadores", "scorers", content, categoryId);
}
