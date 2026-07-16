import { renderLayout } from "./layout";

const POSITION_MAP: Record<string, { code: string; label: string; badgeColor: string }> = {
  "DELANTERO": { code: "DC", label: "Delantero Centro", badgeColor: "#f43f5e" },
  "MEDIOCAMPISTA": { code: "MC", label: "Mediocentro / Mixto", badgeColor: "#10b981" },
  "DEFENSA": { code: "DFC", label: "Defensa Central / Lateral", badgeColor: "#38bdf8" },
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
  "DC": { code: "DC", label: "Delantero Centro / Ariete", badgeColor: "#f43f5e" }
};

export async function renderTeamDetailView(team: any): Promise<string> {
  const categoryId = team.categoryId || (team.category ? team.category.id : "");
  const categoryName = team.category ? team.category.name : "Categoría CONDEPOR";
  const players = team.players || [];
  const crestText = team.name ? team.name.substring(0, 3).toUpperCase() : "CLB";

  const totalGoals = players.reduce((acc: number, p: any) => acc + (p.seasonGoals || 0), 0);
  const totalPoints = players.reduce((acc: number, p: any) => acc + (p.seasonPoints || 0), 0);

  const playersRows = players.map((p: any) => {
    const posInfo = POSITION_MAP[p.position?.toUpperCase()] || { code: p.position || "JUG", label: p.position || "Jugador de Campo", badgeColor: "#64748b" };
    // Determinar posibles posiciones alternativas según la línea para mostrar versatilidad
    let altPositions = "";
    if (posInfo.code === "POR") altPositions = "<span style='font-size: 0.75rem; color: #94a3b8;'>Especialista [POR]</span>";
    else if (posInfo.code === "DFC" || posInfo.code.includes("DEF")) altPositions = "<span style='font-size: 0.75rem; color: #94a3b8;'>Posibles: [DFC, LI, LD]</span>";
    else if (posInfo.code === "MC" || posInfo.code.includes("MED")) altPositions = "<span style='font-size: 0.75rem; color: #94a3b8;'>Posibles: [MCD, MC, MCO]</span>";
    else if (posInfo.code === "DC" || posInfo.code.includes("DEL")) altPositions = "<span style='font-size: 0.75rem; color: #94a3b8;'>Posibles: [EI, ED, DC]</span>";
    else altPositions = `<span style='font-size: 0.75rem; color: #94a3b8;'>Posibles: [${posInfo.code}]</span>`;

    return `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.06); transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='transparent'">
        <td style="padding: 1.1rem 1.25rem;">
          <div style="width: 38px; height: 38px; border-radius: 10px; background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05)); border: 1px solid rgba(245, 158, 11, 0.4); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; color: #f59e0b; font-family: monospace;">
            #${p.jerseyNumber}
          </div>
        </td>
        <td style="padding: 1.1rem 1.25rem;">
          <div style="font-weight: 700; color: #fff; font-size: 1.05rem;">${p.name}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${altPositions}</div>
        </td>
        <td style="padding: 1.1rem 1.25rem;">
          <span style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.85rem; border-radius: 20px; font-weight: 700; font-size: 0.8rem; background: ${posInfo.badgeColor}22; color: ${posInfo.badgeColor}; border: 1px solid ${posInfo.badgeColor}55;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: ${posInfo.badgeColor};"></span>
            ${posInfo.code} - ${posInfo.label}
          </span>
        </td>
        <td style="padding: 1.1rem 1.25rem; text-align: center;">
          <span style="font-weight: 800; font-size: 1.15rem; color: #fff; background: rgba(255,255,255,0.07); padding: 0.3rem 0.8rem; border-radius: 8px;">
            ${p.seasonGoals || 0} ⚽
          </span>
        </td>
        <td style="padding: 1.1rem 1.25rem; text-align: center;">
          <span style="font-weight: 800; font-size: 1.15rem; color: #f59e0b; background: rgba(245,158,11,0.1); padding: 0.3rem 0.8rem; border-radius: 8px; border: 1px solid rgba(245,158,11,0.25);">
            ${p.seasonPoints?.toFixed(1) || "0.0"} pts
          </span>
        </td>
        <td style="padding: 1.1rem 1.25rem; text-align: center;">
          <button onclick="removePlayer('${team.id}', '${p.id}', '${p.name.replace(/'/g, "\\'")}')" title="Quitar de plantilla" style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #f87171; border-radius: 8px; padding: 0.4rem 0.8rem; cursor: pointer; font-weight: 700; font-size: 0.8rem; transition: all 0.2s;">
            🗑️ Quitar
          </button>
        </td>
      </tr>
    `;
  }).join("");

  const content = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1.5rem; background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.4)); padding: 2rem; border-radius: 24px; border: 1px solid var(--border); box-shadow: 0 20px 40px rgba(0,0,0,0.5); position: relative; overflow: hidden;">
      <div style="position: absolute; top: -50px; right: -50px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%); pointer-events: none;"></div>

      <div style="display: flex; align-items: center; gap: 1.75rem;">
        <div style="width: 90px; height: 90px; border-radius: 22px; background: linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(14, 165, 233, 0.2)); border: 2px solid #f59e0b; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 2rem; color: #f59e0b; box-shadow: 0 10px 25px rgba(0,0,0,0.4);">
          ${team.crestUrl ? `<img src="${team.crestUrl}" style="width: 60px; height: 60px; object-fit: contain;" alt="${team.name}">` : crestText}
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
            <a href="/api/teams?categoryId=${categoryId}" style="font-size: 0.85rem; color: #38bdf8; font-weight: 700; text-decoration: none;">&larr; Volver a Clubes</a>
            <span class="badge" style="background: rgba(234, 179, 8, 0.15); color: #f59e0b; border: 1px solid rgba(234, 179, 8, 0.3);">
              ${categoryName}
            </span>
          </div>
          <h1 style="font-size: 2.8rem; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.03em;">${team.name}</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin: 0.3rem 0 0 0;">
            Plantilla Oficial de Competición • Nomenclatura Táctica CONDEPOR (POR/DFC/MC/DC)
          </p>
        </div>
      </div>

      <div style="display: flex; gap: 1rem; align-items: center;">
        <div style="text-align: right; padding-right: 1.5rem; border-right: 1px solid var(--border);">
          <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Roster Total</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #38bdf8;">${players.length} <span style="font-size: 1rem; font-weight: 600;">Atletas</span></div>
        </div>
        <div style="text-align: right; padding-right: 1.5rem; border-right: 1px solid var(--border);">
          <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Goles Club</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #f59e0b;">${totalGoals} <span style="font-size: 1rem; font-weight: 600;">⚽</span></div>
        </div>
        <button onclick="openAddPlayerModal()" class="btn btn-primary" style="background: linear-gradient(135deg, #10b981, #059669); box-shadow: 0 8px 20px -6px rgba(16, 185, 129, 0.4); padding: 0.8rem 1.4rem;">
          <span>➕ Registrar Jugador</span>
        </button>
      </div>
    </div>

    <!-- TABLA DE JUGADORES / PLANTILLA -->
    <div class="card" style="padding: 0; overflow: hidden; margin-bottom: 3rem;">
      <div style="padding: 1.5rem 1.75rem; background: rgba(0,0,0,0.25); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between;">
        <h3 style="font-size: 1.3rem; font-weight: 800; color: #fff; margin: 0;">Roster Oficial & Tácticas del Equipo</h3>
        <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">⚽ Ordenados por Dorsal</span>
      </div>

      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.02); color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">
              <th style="padding: 1rem 1.25rem; width: 90px;">Dorsal</th>
              <th style="padding: 1rem 1.25rem;">Atleta / Nombre</th>
              <th style="padding: 1rem 1.25rem;">Posición & Rol en Campo</th>
              <th style="padding: 1rem 1.25rem; text-align: center;">Goles (Temp.)</th>
              <th style="padding: 1rem 1.25rem; text-align: center;">Puntos CONDEPOR</th>
              <th style="padding: 1rem 1.25rem; text-align: center; width: 100px;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${playersRows || `
              <tr>
                <td colspan="6" style="padding: 4rem; text-align: center; color: var(--text-muted);">
                  Este club no tiene jugadores registrados en la plantilla. Haz clic en "➕ Registrar Jugador" para inscribir al primero.
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL REGISTRAR JUGADOR -->
    <div id="playerModal" style="display: none; position: fixed; inset: 0; background: rgba(4, 7, 15, 0.85); backdrop-filter: blur(12px); z-index: 1000; align-items: center; justify-content: center; padding: 1.5rem;">
      <div class="card" style="max-width: 520px; width: 100%; border-color: #10b981; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
          <span style="font-size: 1.8rem;">⚽</span>
          <div>
            <h3 style="font-size: 1.4rem; font-weight: 800; color: #fff; margin: 0;">Inscribir Atleta en Plantilla</h3>
            <div style="font-size: 0.85rem; color: var(--text-muted);">Club: ${team.name}</div>
          </div>
        </div>

        <form id="playerForm" onsubmit="submitPlayer(event)">
          <input type="hidden" id="modalTeamId" value="${team.id}">
          <input type="hidden" id="modalCategoryId" value="${categoryId}">
          
          <div style="display: grid; grid-template-columns: 100px 1fr; gap: 1rem; margin-bottom: 1.25rem;">
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase;">Dorsal *</label>
              <input type="number" id="playerNumberInput" required min="1" max="99" placeholder="10" style="width: 100%; padding: 0.85rem; border-radius: 12px; background: rgba(0,0,0,0.6); border: 1px solid var(--border); color: #fff; font-size: 1.1rem; font-weight: 800; text-align: center; outline: none;">
            </div>
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase;">Nombre Completo del Atleta *</label>
              <input type="text" id="playerNameInput" required placeholder="Ej: Carlos Mejía" style="width: 100%; padding: 0.85rem 1rem; border-radius: 12px; background: rgba(0,0,0,0.6); border: 1px solid var(--border); color: #fff; font-size: 1rem; font-weight: 600; outline: none;">
            </div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase;">Posición y Demarcación Táctica (Nomenclatura Oficial CONDEPOR) *</label>
            <select id="playerPositionInput" required onchange="suggestJerseyNumber(this.value)" style="width: 100%; padding: 0.85rem 1rem; border-radius: 12px; background: #0b0f19; border: 1px solid var(--border); color: #fff; font-size: 0.95rem; font-weight: 600; outline: none;">
              <option value="POR">POR - Portero / Guardameta (Dorsal típico: #1)</option>
              <option value="DFC">DFC - Defensa Central (Dorsales típicos: #4, #5)</option>
              <option value="LD">LD - Defensa Lateral Derecho (Dorsal típico: #2)</option>
              <option value="LI">LI - Defensa Lateral Izquierdo (Dorsal típico: #3)</option>
              <option value="MCD">MCD - Mediocampista Defensivo / Contención (Dorsal típico: #6)</option>
              <option value="MC" selected>MC - Mediocampista Mixto / Todocampista (Dorsal típico: #8)</option>
              <option value="MCO">MCO - Mediocampista Ofensivo / Mediapunta (Dorsal típico: #10)</option>
              <option value="DC">DC - Delantero Centro / Ariete (Dorsal típico: #9)</option>
              <option value="ED">ED - Extremo Derecho (Dorsal típico: #7)</option>
              <option value="EI">EI - Extremo Izquierdo (Dorsal típico: #11)</option>
            </select>
          </div>

          <div style="margin-bottom: 1.75rem;">
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase;">Posibles Posiciones / Roles Alternativos (Opcional)</label>
            <input type="text" id="playerAltInput" placeholder="Ej: DFC, MCD, LI (Opcional para referencia táctica)" style="width: 100%; padding: 0.85rem 1rem; border-radius: 12px; background: rgba(0,0,0,0.6); border: 1px solid var(--border); color: #fff; font-size: 0.9rem; outline: none;">
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
            <button type="button" onclick="closePlayerModal()" class="btn btn-outline">Cancelar</button>
            <button type="submit" class="btn btn-primary" style="background: linear-gradient(135deg, #10b981, #059669);">Inscribir Atleta &rarr;</button>
          </div>
        </form>
      </div>
    </div>

    <script>
      function suggestJerseyNumber(pos) {
        const input = document.getElementById('playerNumberInput');
        if (!input) return;
        const suggestions = {
          'POR': 1, 'DFC': 4, 'LD': 2, 'LI': 3,
          'MCD': 6, 'MC': 8, 'MCO': 10,
          'DC': 9, 'ED': 7, 'EI': 11
        };
        if (suggestions[pos] && !input.value) {
          input.value = suggestions[pos];
        }
      }

      function openAddPlayerModal() {
        document.getElementById('playerModal').style.display = 'flex';
        suggestJerseyNumber(document.getElementById('playerPositionInput').value);
      }

      function closePlayerModal() {
        document.getElementById('playerModal').style.display = 'none';
      }

      function submitPlayer(e) {
        e.preventDefault();
        const teamId = document.getElementById('modalTeamId').value;
        const categoryId = document.getElementById('modalCategoryId').value;
        const jerseyNumber = parseInt(document.getElementById('playerNumberInput').value);
        const name = document.getElementById('playerNameInput').value;
        const position = document.getElementById('playerPositionInput').value;

        fetch('/api/teams/' + teamId + '/players', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teamId, categoryId, jerseyNumber, name, position })
        }).then(r => r.json()).then(res => {
          if(res.success || res.id || res.name) {
            window.location.reload();
          } else {
            alert('Error al inscribir jugador: ' + (res.error || 'Desconocido'));
          }
        });
      }

      function removePlayer(teamId, playerId, name) {
        if(confirm('¿Estás seguro de quitar a "' + name + '" de la plantilla de este club?')) {
          fetch('/api/teams/' + teamId + '/players/' + playerId, {
            method: 'DELETE'
          }).then(r => r.json()).then(res => {
            if(res.success) {
              window.location.reload();
            } else {
              alert('Error al eliminar jugador: ' + (res.error || 'Desconocido'));
            }
          });
        }
      }
    </script>
  `;
  return await renderLayout(`Plantilla ${team.name}`, "teams", content, categoryId);
}
