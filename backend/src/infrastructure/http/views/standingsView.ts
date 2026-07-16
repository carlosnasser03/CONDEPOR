import { renderLayout } from "./layout";

export async function renderStandingsView(standings: any[], categoryId: string): Promise<string> {
  const rowsHtml = standings.map((item, idx) => {
    let posBadge = `<span style="font-weight: 800; font-size: 1.1rem; color: var(--text-muted);">${item.position}</span>`;
    if (item.position === 1) posBadge = `<span style="font-size: 1.35rem;" title="Líder Oficial">🥇 1º</span>`;
    else if (item.position === 2) posBadge = `<span style="font-size: 1.35rem;" title="Subcampeón">🥈 2º</span>`;
    else if (item.position === 3) posBadge = `<span style="font-size: 1.35rem;" title="Tercer Lugar">🥉 3º</span>`;

    const gdColor = item.goalDifference > 0 ? '#10b981' : (item.goalDifference < 0 ? '#f87171' : '#94a3b8');
    const crestText = item.teamName ? item.teamName.substring(0, 3).toUpperCase() : "CLB";

    return `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.06); transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.04)'" onmouseout="this.style.background='transparent'">
        <td style="text-align: center; padding: 1.2rem;">${posBadge}</td>
        <td style="padding: 1.2rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(56, 189, 248, 0.15)); border: 1px solid rgba(245, 158, 11, 0.4); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; color: #f59e0b; font-family: monospace;">
              ${item.crestUrl ? `<img src="${item.crestUrl}" style="width: 26px; height: 26px; object-fit: contain;" alt="${item.teamName}">` : crestText}
            </div>
            <div>
              <span style="font-weight: 800; font-size: 1.15rem; color: #fff; letter-spacing: -0.02em;">${item.teamName}</span>
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Club de Competición Oficial</div>
            </div>
          </div>
        </td>
        <td style="text-align: center; font-weight: 800; font-size: 1.4rem; color: #f59e0b; background: rgba(245, 158, 11, 0.08); border-left: 1px solid rgba(245,158,11,0.2); border-right: 1px solid rgba(245,158,11,0.2);">${item.points}</td>
        <td style="text-align: center; color: var(--text-muted); font-weight: 700; font-size: 1.05rem;">${item.played}</td>
        <td style="text-align: center; color: #10b981; font-weight: 700; font-size: 1.05rem;">${item.wins}</td>
        <td style="text-align: center; color: #38bdf8; font-weight: 700; font-size: 1.05rem;">${item.draws}</td>
        <td style="text-align: center; color: #f87171; font-weight: 700; font-size: 1.05rem;">${item.losses}</td>
        <td style="text-align: center; font-weight: 600;">${item.goalsFor}</td>
        <td style="text-align: center; font-weight: 600;">${item.goalsAgainst}</td>
        <td style="text-align: center; font-weight: 800; font-size: 1.1rem; color: ${gdColor};">${item.goalDifference > 0 ? '+' : ''}${item.goalDifference}</td>
      </tr>
    `;
  }).join("");

  const content = `
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <div class="badge badge-primary" style="margin-bottom: 0.75rem;">🏆 CLASIFICACIÓN OFICIAL DE LA LIGA</div>
        <h1 style="font-size: 2.6rem; font-weight: 800; color: #fff; letter-spacing: -0.03em;">Tabla de Posiciones</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; margin-top: 0.25rem; max-width: 680px; line-height: 1.5;">
          Cálculo riguroso, criterios de desempate y estadísticas de rendimiento procesadas en tiempo real por el dominio <code>StandingsCalculator</code>.
        </p>
      </div>
      <a href="/api/standings/${categoryId}" onclick="fetchAndShowJson(event, '/api/standings/${categoryId}')" class="btn btn-outline">
        <span>📄 Ver JSON RAW</span>
      </a>
    </div>

    <div class="card" style="padding: 0; overflow: hidden; border-color: rgba(245, 158, 11, 0.3); box-shadow: 0 25px 60px rgba(0,0,0,0.6);">
      <div class="table-container" style="border: none; border-radius: 0;">
        <table>
          <thead>
            <tr style="background: rgba(0,0,0,0.4); border-bottom: 1px solid var(--border);">
              <th style="width: 90px; text-align: center;">Pos</th>
              <th style="padding-left: 1.2rem;">Club / Equipo</th>
              <th style="text-align: center; color: #f59e0b; font-size: 0.95rem;">Puntos</th>
              <th style="text-align: center;">PJ</th>
              <th style="text-align: center; color: #10b981;">G</th>
              <th style="text-align: center; color: #38bdf8;">E</th>
              <th style="text-align: center; color: #f87171;">P</th>
              <th style="text-align: center;">GF</th>
              <th style="text-align: center;">GC</th>
              <th style="text-align: center;">DG</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || `<tr><td colspan="10" style="text-align: center; padding: 4rem; color: var(--text-muted);">No hay equipos inscritos aún en esta categoría.</td></tr>`}
          </tbody>
        </table>
      </div>
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
  return await renderLayout("Tabla de Posiciones", "standings", content, categoryId);
}
