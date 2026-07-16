import { renderLayout } from "./layout";

export async function renderTeamsView(teams: any[], categoryId: string, categoryName: string): Promise<string> {
  const cardsHtml = teams.map((team, idx) => {
    const crestText = team.name ? team.name.substring(0, 3).toUpperCase() : "CLB";
    const playerCount = team._count ? team._count.players : (team.players ? team.players.length : "15");

    return `
      <div class="card" style="display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; right: 0; width: 120px; height: 120px; background: radial-gradient(circle, var(--primary-glow) 0%, transparent 70%); pointer-events: none;"></div>
        
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
            <div style="width: 58px; height: 58px; border-radius: 16px; background: linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(14, 165, 233, 0.15)); border: 1px solid rgba(234, 179, 8, 0.3); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem; color: #f59e0b; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
              ${team.crestUrl ? `<img src="${team.crestUrl}" style="width: 36px; height: 36px; object-fit: contain;" alt="${team.name}" onerror="this.style.display='none'; this.parentNode.innerText='${crestText}';">` : crestText}
            </div>
            <span class="badge" style="background: rgba(14, 165, 233, 0.12); color: #38bdf8; border: 1px solid rgba(14, 165, 233, 0.3);">
              🏆 Categoría Oficial
            </span>
          </div>

          <h3 style="font-size: 1.4rem; font-weight: 800; color: #fff; margin-bottom: 0.4rem; letter-spacing: -0.02em;">${team.name}</h3>
          <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 500;">
            CUID: <code style="font-size: 0.75rem; color: #64748b;">${team.id}</code>
          </div>
        </div>

        <div style="margin-top: 1.75rem; padding-top: 1.25rem; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.9rem; font-weight: 600;">
            <span style="font-size: 1.1rem;">👥</span> ${playerCount} Jugadores
          </div>
          <a href="/api/teams/${team.id}" class="btn btn-primary" style="padding: 0.55rem 1.1rem; font-size: 0.85rem;">
            Ver Plantilla &rarr;
          </a>
        </div>
      </div>
    `;
  }).join("");

  const content = `
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <div class="badge badge-primary" style="margin-bottom: 0.75rem;">🛡️ GESTIÓN DE CLUBES & ROSTERS</div>
        <h1 style="font-size: 2.6rem; font-weight: 800; color: #fff; letter-spacing: -0.03em;">Clubes Inscritos</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; margin-top: 0.25rem; max-width: 650px; line-height: 1.5;">
          Explora los clubes inscritos en el torneo activo <strong>${categoryName}</strong>. Selecciona una plantilla para gestionar jugadores, dorsales y tácticas de juego.
        </p>
      </div>
      <div style="display: flex; gap: 1rem;">
        <button onclick="openCreateTeamModal()" class="btn btn-primary" style="background: linear-gradient(135deg, #f59e0b, #d97706); box-shadow: 0 8px 20px -6px rgba(245, 158, 11, 0.4);">
          <span>➕ Inscribir Nuevo Club</span>
        </button>
        <a href="/api/teams?categoryId=${categoryId}" onclick="fetchAndShowJson(event, '/api/teams?categoryId=${categoryId}')" class="btn btn-outline">
          <span>📄 Ver JSON RAW</span>
        </a>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
      ${cardsHtml || `<div class="card" style="grid-column: 1 / -1; text-align: center; padding: 4rem; color: var(--text-muted);">No hay clubes inscritos aún en esta categoría. Puedes registrar el primero haciendo clic en "➕ Inscribir Nuevo Club".</div>`}
    </div>

    <!-- MODAL CREAR EQUIPO -->
    <div id="teamModal" style="display: none; position: fixed; inset: 0; background: rgba(4, 7, 15, 0.85); backdrop-filter: blur(12px); z-index: 1000; align-items: center; justify-content: center; padding: 1.5rem;">
      <div class="card" style="max-width: 480px; width: 100%; border-color: #f59e0b; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
          <span style="font-size: 1.8rem;">🛡️</span>
          <div>
            <h3 style="font-size: 1.4rem; font-weight: 800; color: #fff;">Inscribir Nuevo Club</h3>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Torneo: ${categoryName}</div>
          </div>
        </div>

        <form id="teamForm" onsubmit="submitTeam(event)">
          <input type="hidden" id="modalCategoryId" value="${categoryId}">
          
          <div style="margin-bottom: 1.25rem;">
            <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase;">Nombre Oficial del Club *</label>
            <input type="text" id="teamNameInput" required placeholder="Ej: Real Honduras FC" style="width: 100%; padding: 0.85rem 1rem; border-radius: 12px; background: rgba(0,0,0,0.6); border: 1px solid var(--border); color: #fff; font-size: 1rem; font-weight: 600; outline: none;">
          </div>

          <div style="margin-bottom: 1.75rem;">
            <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase;">URL de Escudo / Cresta (Opcional)</label>
            <input type="url" id="teamCrestInput" placeholder="https://ejemplo.com/escudo.png" style="width: 100%; padding: 0.85rem 1rem; border-radius: 12px; background: rgba(0,0,0,0.6); border: 1px solid var(--border); color: #fff; font-size: 0.95rem; outline: none;">
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
            <button type="button" onclick="closeTeamModal()" class="btn btn-outline">Cancelar</button>
            <button type="submit" class="btn btn-primary" style="background: linear-gradient(135deg, #f59e0b, #d97706);">Guardar Club &rarr;</button>
          </div>
        </form>
      </div>
    </div>

    <script>
      function openCreateTeamModal() {
        document.getElementById('teamModal').style.display = 'flex';
      }

      function closeTeamModal() {
        document.getElementById('teamModal').style.display = 'none';
      }

      function submitTeam(e) {
        e.preventDefault();
        const categoryId = document.getElementById('modalCategoryId').value;
        const name = document.getElementById('teamNameInput').value;
        const crestUrl = document.getElementById('teamCrestInput').value;

        fetch('/api/teams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoryId, name, crestUrl })
        }).then(r => r.json()).then(res => {
          if(res.success || res.id || res.name) {
            window.location.reload();
          } else {
            alert('Error al inscribir club: ' + (res.error || 'Desconocido'));
          }
        });
      }

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
  return await renderLayout("Clubes & Plantillas", "teams", content, categoryId);
}
