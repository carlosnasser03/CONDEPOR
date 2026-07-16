import { renderLayout } from "./layout";

export async function renderMatchesView(matches: any[], categoryId: string): Promise<string> {
  const matchesHtml = matches.map((item) => {
    const isFinished = item.status === "finished";
    const isLive = item.status === "in_progress";
    const dateStr = new Date(item.date).toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const homeCrest = item.homeTeam?.name ? item.homeTeam.name.substring(0, 3).toUpperCase() : "LOC";
    const awayCrest = item.awayTeam?.name ? item.awayTeam.name.substring(0, 3).toUpperCase() : "VIS";

    // Extraer goleadores si el partido tiene acta
    const homeScorers = (item.playerStats || []).filter((s: any) => s.goals > 0 && s.player?.teamId === item.homeTeamId);
    const awayScorers = (item.playerStats || []).filter((s: any) => s.goals > 0 && s.player?.teamId === item.awayTeamId);

    return `
      <div class="card" style="padding: 0; position: relative; overflow: hidden; border: 1px solid ${isFinished ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}; border-radius: 20px; background: #0b111e; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
        <!-- Top Header MARCA style -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding: 0.75rem 1.8rem; background: rgba(0,0,0,0.4); font-size: 0.82rem; font-weight: 700; color: #94a3b8; letter-spacing: 0.04em;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="color: #f59e0b;">🏆 PRIMERA DIVISIÓN</span> • <span style="color: #e2e8f0;">🏟️ ${item.venue}</span>
          </div>
          <div>
            ${isFinished 
              ? '<span style="background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.4); padding: 0.2rem 0.8rem; border-radius: 999px; font-weight: 800; font-size: 0.75rem; letter-spacing: 0.08em;">FINALIZADO</span>' 
              : isLive 
              ? '<span style="background: rgba(239,68,68,0.2); color: #ef4444; border: 1px solid rgba(239,68,68,0.5); padding: 0.2rem 0.8rem; border-radius: 999px; font-weight: 800; font-size: 0.75rem; letter-spacing: 0.08em; animation: pulse 1.5s infinite;">🔴 EN VIVO</span>'
              : `<span style="color: #38bdf8; font-weight: 700;">📅 ${dateStr}</span>`
            }
          </div>
        </div>

        <!-- Main MARCA Scoreboard Row -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.8rem 2.5rem; gap: 1.5rem; flex-wrap: wrap;">
          
          <!-- Local Team -->
          <div style="display: flex; align-items: center; justify-content: flex-end; gap: 1.25rem; flex: 1; min-width: 220px;">
            <div style="text-align: right;">
              <div style="font-size: 1.5rem; font-weight: 900; color: #ffffff; letter-spacing: -0.02em; line-height: 1.2;">${item.homeTeam ? item.homeTeam.name : 'Local'}</div>
              <div style="font-size: 0.72rem; color: #f59e0b; font-weight: 800; letter-spacing: 0.1em; margin-top: 0.2rem;">LOCAL</div>
            </div>
            ${item.homeTeam?.crestUrl ? `
              <img src="${item.homeTeam.crestUrl}" style="width: 38px; height: 38px; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.7)); flex-shrink: 0;" alt="${item.homeTeam.name}">
            ` : `
              <div style="width: 38px; height: 38px; border-radius: 50%; background: #1e293b; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #f59e0b; font-size: 0.9rem;">${homeCrest}</div>
            `}
          </div>

          <!-- Central Score Pill -->
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 0.25rem;">
            <div style="background: #111827; border: 2px solid ${isFinished ? '#10b981' : isLive ? '#ef4444' : '#38bdf8'}; padding: 0.45rem 1.8rem; border-radius: 14px; box-shadow: inset 0 2px 6px rgba(0,0,0,0.8), 0 6px 16px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; gap: 0.75rem; min-width: 125px;">
              ${isFinished || isLive ? `
                <span style="font-size: 2.2rem; font-weight: 900; color: #ffffff; font-family: monospace; line-height: 1;">${item.homeGoals ?? 0}</span>
                <span style="font-size: 1.5rem; font-weight: 700; color: #64748b; line-height: 1;">-</span>
                <span style="font-size: 2.2rem; font-weight: 900; color: #ffffff; font-family: monospace; line-height: 1;">${item.awayGoals ?? 0}</span>
              ` : `
                <span style="font-size: 1.6rem; font-weight: 900; color: #38bdf8; letter-spacing: 0.1em;">VS</span>
              `}
            </div>
            ${isFinished ? `
              <div style="font-size: 0.68rem; font-weight: 800; color: #34d399; margin-top: 0.35rem; letter-spacing: 0.1em;">RESULTADO OFICIAL</div>
            ` : ''}
          </div>

          <!-- Visitante Team -->
          <div style="display: flex; align-items: center; justify-content: flex-start; gap: 1rem; flex: 1; min-width: 200px;">
            ${item.awayTeam?.crestUrl ? `
              <img src="${item.awayTeam.crestUrl}" style="width: 38px; height: 38px; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.7)); flex-shrink: 0;" alt="${item.awayTeam.name}">
            ` : `
              <div style="width: 38px; height: 38px; border-radius: 50%; background: #1e293b; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #38bdf8; font-size: 0.9rem;">${awayCrest}</div>
            `}
            <div style="text-align: left;">
              <div style="font-size: 1.35rem; font-weight: 900; color: #ffffff; letter-spacing: -0.02em; line-height: 1.2;">${item.awayTeam ? item.awayTeam.name : 'Visitante'}</div>
              <div style="font-size: 0.7rem; color: #38bdf8; font-weight: 800; letter-spacing: 0.1em; margin-top: 0.15rem;">VISITANTE</div>
            </div>
          </div>

        </div>

        <!-- MARCA Goalscorers Strip & Action Footer -->
        <div style="background: rgba(4, 7, 15, 0.75); border-top: 1px solid rgba(255,255,255,0.08); padding: 1rem 1.8rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem;">
          
          <!-- Scorers details -->
          <div style="flex: 1; min-width: 280px; font-size: 0.85rem; color: #cbd5e1; display: flex; flex-direction: column; gap: 0.35rem;">
            ${isFinished || isLive ? `
              <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
                <div>
                  <span style="color: #f59e0b; font-weight: 800;">⚽ Goles Local:</span> 
                  ${homeScorers.length > 0 ? homeScorers.map((s: any) => `<span style="color: #fff; font-weight: 600;">${s.player?.name || 'Jugador'}</span> (${s.goals})`).join(', ') : '<span style="color: #64748b;">Ninguno</span>'}
                </div>
                <div>
                  <span style="color: #38bdf8; font-weight: 800;">⚽ Goles Visitante:</span> 
                  ${awayScorers.length > 0 ? awayScorers.map((s: any) => `<span style="color: #fff; font-weight: 600;">${s.player?.name || 'Jugador'}</span> (${s.goals})`).join(', ') : '<span style="color: #64748b;">Ninguno</span>'}
                </div>
              </div>
            ` : `
              <div style="color: #64748b; font-style: italic;">Esperando inicio del partido para registro de goles y acta.</div>
            `}
          </div>

          <!-- Buttons -->
          <div style="display: flex; gap: 0.6rem; align-items: center;">
            ${!isFinished ? `
              <button onclick="openResultModal('${item.id}', '${item.homeTeam ? item.homeTeam.name.replace(/'/g, "\\'") : 'Local'}', '${item.awayTeam ? item.awayTeam.name.replace(/'/g, "\\'") : 'Visitante'}', '${item.homeTeamId}', '${item.awayTeamId}')" class="btn btn-primary" style="background: linear-gradient(135deg, #f59e0b, #d97706); box-shadow: 0 8px 20px -6px rgba(245, 158, 11, 0.4); padding: 0.65rem 1.3rem; font-size: 0.85rem; font-weight: 800;">
                <span>⚡ Registrar Resultado & Acta</span>
              </button>
            ` : `
              <button onclick="openResultModal('${item.id}', '${item.homeTeam ? item.homeTeam.name.replace(/'/g, "\\'") : 'Local'}', '${item.awayTeam ? item.awayTeam.name.replace(/'/g, "\\'") : 'Visitante'}', '${item.homeTeamId}', '${item.awayTeamId}', ${item.homeGoals || 0}, ${item.awayGoals || 0})" class="btn btn-outline" style="padding: 0.6rem 1.2rem; font-size: 0.82rem; border-color: #10b981; color: #34d399; font-weight: 700;">
                <span>✏️ Editar Acta / Goleadores</span>
              </button>
            `}
            <button onclick="deleteMatch('${item.id}')" title="Eliminar Partido" style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #f87171; border-radius: 12px; padding: 0.65rem 0.95rem; cursor: pointer; font-weight: 700; font-size: 0.85rem;">
              🗑️
            </button>
          </div>

        </div>
      </div>
    `;
  }).join("");

  const content = `
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <div class="badge badge-primary" style="margin-bottom: 0.75rem;">📅 CALENDARIO & ACTAS OFICIALES</div>
        <h1 style="font-size: 2.6rem; font-weight: 800; color: #fff; letter-spacing: -0.03em;">Jornadas y Resultados</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; margin-top: 0.25rem; max-width: 680px; line-height: 1.5;">
          En cada partido puedes ingresar el marcador global y el <strong>Acta Individual (Goleadores, Asistencias, Minutos jugados, Porterías a Cero)</strong> que alimenta automáticamente al Motor de Scoring CONDEPOR.
        </p>
      </div>
      <div style="display: flex; gap: 1rem; align-items: center;">
        <button onclick="openCreateMatchModal()" class="btn btn-primary" style="background: linear-gradient(135deg, #38bdf8, #0284c7); box-shadow: 0 8px 20px -6px rgba(56, 189, 248, 0.4);">
          <span>➕ Programar Partido</span>
        </button>
        <a href="/api/matches?categoryId=${categoryId}" onclick="fetchAndShowJson(event, '/api/matches?categoryId=${categoryId}')" class="btn btn-outline">
          <span>📄 Ver JSON RAW</span>
        </a>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 3rem;">
      ${matchesHtml || `<div class="card" style="text-align: center; padding: 4rem; color: var(--text-muted);">No hay partidos programados o finalizados aún para esta categoría.</div>`}
    </div>

    <!-- MODAL REGISTRO DE RESULTADOS & ACTA INDIVIDUAL -->
    <div id="resultModal" style="display: none; position: fixed; inset: 0; background: rgba(4, 7, 15, 0.88); backdrop-filter: blur(14px); z-index: 1000; align-items: center; justify-content: center; padding: 1.5rem; overflow-y: auto;">
      <div class="card" style="max-width: 680px; width: 100%; border-color: #f59e0b; box-shadow: 0 25px 60px -12px rgba(0,0,0,0.8); max-height: 90vh; overflow-y: auto; margin: auto;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.8rem;">⚡</span>
            <div>
              <h3 style="font-size: 1.4rem; font-weight: 800; color: #fff; margin: 0;">Acta Oficial del Partido</h3>
              <div id="modalSub" style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;"></div>
            </div>
          </div>
          <button type="button" onclick="closeModal()" style="background: transparent; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>

        <form id="resultForm" onsubmit="submitResult(event)">
          <input type="hidden" id="matchIdInput">
          
          <!-- MARCADOR GLOBAL -->
          <div style="background: rgba(0,0,0,0.4); border: 1px solid var(--border); border-radius: 16px; padding: 1.25rem; margin-bottom: 1.5rem;">
            <div style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #f59e0b; margin-bottom: 0.75rem; letter-spacing: 0.05em;">Marcador Global del Partido</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
              <div>
                <label id="homeLabel" style="display: block; font-size: 0.85rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;"></label>
                <input type="number" id="homeGoalsInput" required min="0" value="2" style="width: 100%; padding: 0.85rem; border-radius: 12px; background: #0b0f19; border: 1px solid #f59e0b; color: #fff; font-size: 1.4rem; font-weight: 800; text-align: center; outline: none;">
              </div>
              <div>
                <label id="awayLabel" style="display: block; font-size: 0.85rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;"></label>
                <input type="number" id="awayGoalsInput" required min="0" value="1" style="width: 100%; padding: 0.85rem; border-radius: 12px; background: #0b0f19; border: 1px solid #38bdf8; color: #fff; font-size: 1.4rem; font-weight: 800; text-align: center; outline: none;">
              </div>
            </div>
          </div>

          <!-- SECCIÓN GOLEADORES Y ESTADÍSTICAS INDIVIDUALES -->
          <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 16px; padding: 1.25rem; margin-bottom: 1.75rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
              <div>
                <div style="font-size: 0.9rem; font-weight: 800; color: #fff;">⚽ Goleadores & Estadísticas Individuales (Acta)</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Asigna los goles, asistencias y minutos para actualizar los Top Goleadores y Puntos CONDEPOR en tiempo real.</div>
              </div>
              <button type="button" onclick="addPlayerStatRow()" class="btn btn-outline" style="padding: 0.45rem 0.9rem; font-size: 0.8rem; border-color: #10b981; color: #34d399;">
                ➕ Agregar Jugador
              </button>
            </div>

            <div id="playerStatsList" style="display: flex; flex-direction: column; gap: 0.75rem; max-height: 250px; overflow-y: auto; padding-right: 0.5rem;">
              <!-- Filas dinámicas de jugadores aquí -->
            </div>
            <div id="noStatsMessage" style="text-align: center; padding: 1.5rem; color: var(--text-muted); font-size: 0.85rem; border: 1px dashed var(--border); border-radius: 12px;">
              No has agregado estadísticas individuales al partido. Haz clic en "➕ Agregar Jugador" para registrar quién anotó los goles o dio asistencias.
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
            <button type="button" onclick="closeModal()" class="btn btn-outline">Cancelar</button>
            <button type="submit" class="btn btn-primary" style="background: linear-gradient(135deg, #10b981, #059669); padding: 0.85rem 1.8rem; font-size: 1rem;">
              <span>💾 Guardar Acta & Resultado &rarr;</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <script>
      let currentRosters = []; // Array de { id, name, number, teamName, teamType }

      async function openResultModal(id, home, away, homeId, awayId, defaultHome = 2, defaultAway = 1) {
        document.getElementById('matchIdInput').value = id;
        document.getElementById('modalSub').innerText = home + ' vs ' + away;
        document.getElementById('homeLabel').innerText = '⚽ Goles ' + home;
        document.getElementById('awayLabel').innerText = '⚽ Goles ' + away;
        document.getElementById('homeGoalsInput').value = defaultHome;
        document.getElementById('awayGoalsInput').value = defaultAway;
        document.getElementById('playerStatsList').innerHTML = '';
        document.getElementById('noStatsMessage').style.display = 'block';

        // Cargar jugadores de los 2 clubes en segundo plano para el dropdown
        currentRosters = [];
        try {
          const resHome = await fetch('/api/teams/' + homeId).then(r => r.json());
          if (resHome.team && resHome.team.players) {
            resHome.team.players.forEach(p => {
              currentRosters.push({ id: p.id, name: p.name, number: p.jerseyNumber, teamName: home, teamType: 'LOCAL' });
            });
          }
          const resAway = await fetch('/api/teams/' + awayId).then(r => r.json());
          if (resAway.team && resAway.team.players) {
            resAway.team.players.forEach(p => {
              currentRosters.push({ id: p.id, name: p.name, number: p.jerseyNumber, teamName: away, teamType: 'VISITANTE' });
            });
          }
        } catch(e) {
          console.error("Error cargando plantillas:", e);
        }

        document.getElementById('resultModal').style.display = 'flex';
      }

      function addPlayerStatRow() {
        if (currentRosters.length === 0) {
          alert("Aún no hay jugadores registrados en las plantillas de estos clubes.");
          return;
        }

        document.getElementById('noStatsMessage').style.display = 'none';
        const container = document.getElementById('playerStatsList');
        const rowId = 'stat_row_' + Date.now();

        let optionsHtml = currentRosters.map(p => {
          const badge = p.teamType === 'LOCAL' ? '🏠' : '✈️';
          return \`<option value="\${p.id}">\${badge} [\${p.teamType}] #\${p.number} - \${p.name}</option>\`;
        }).join('');

        const rowHtml = \`
          <div id="\${rowId}" class="stat-row" style="display: grid; grid-template-columns: 2fr 70px 70px 70px 80px 32px; gap: 0.5rem; align-items: center; background: rgba(255,255,255,0.03); padding: 0.6rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.06);">
            <div>
              <select class="stat-player-id" style="width: 100%; padding: 0.45rem; border-radius: 8px; background: #0b0f19; border: 1px solid var(--border); color: #fff; font-size: 0.8rem; outline: none;">
                \${optionsHtml}
              </select>
            </div>
            <div>
              <input type="number" class="stat-goals" min="0" max="15" value="1" placeholder="Goles" title="Goles" style="width: 100%; padding: 0.45rem; border-radius: 8px; background: #0b0f19; border: 1px solid #f59e0b; color: #fff; font-size: 0.85rem; font-weight: 700; text-align: center;">
            </div>
            <div>
              <input type="number" class="stat-assists" min="0" max="15" value="0" placeholder="Asist." title="Asistencias" style="width: 100%; padding: 0.45rem; border-radius: 8px; background: #0b0f19; border: 1px solid var(--border); color: #fff; font-size: 0.85rem; text-align: center;">
            </div>
            <div>
              <input type="number" class="stat-minutes" min="1" max="90" value="60" placeholder="Min." title="Minutos jugados" style="width: 100%; padding: 0.45rem; border-radius: 8px; background: #0b0f19; border: 1px solid var(--border); color: #fff; font-size: 0.85rem; text-align: center;">
            </div>
            <div style="text-align: center;">
              <label style="font-size: 0.7rem; color: var(--text-muted); display: block; cursor: pointer;">
                <input type="checkbox" class="stat-cleansheet" style="margin-right: 0.2rem;"> Cero
              </label>
            </div>
            <div>
              <button type="button" onclick="document.getElementById('\${rowId}').remove(); if(document.querySelectorAll('.stat-row').length === 0) document.getElementById('noStatsMessage').style.display='block';" style="background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #f87171; border-radius: 6px; width: 28px; height: 28px; cursor: pointer; font-weight: 800;">&times;</button>
            </div>
          </div>
        \`;

        container.insertAdjacentHTML('beforeend', rowHtml);
      }

      function closeModal() {
        document.getElementById('resultModal').style.display = 'none';
      }

      function submitResult(e) {
        e.preventDefault();
        const matchId = document.getElementById('matchIdInput').value;
        const homeGoals = parseInt(document.getElementById('homeGoalsInput').value);
        const awayGoals = parseInt(document.getElementById('awayGoalsInput').value);

        // Recopilar filas de estadísticas individuales
        const rows = document.querySelectorAll('.stat-row');
        const playerStats = [];
        rows.forEach(row => {
          const playerId = row.querySelector('.stat-player-id').value;
          const goals = parseInt(row.querySelector('.stat-goals').value || '0');
          const assists = parseInt(row.querySelector('.stat-assists').value || '0');
          const minutesPlayed = parseInt(row.querySelector('.stat-minutes').value || '60');
          const cleanSheet = row.querySelector('.stat-cleansheet').checked;

          playerStats.push({ playerId, goals, assists, minutesPlayed, cleanSheet });
        });

        fetch('/api/matches/' + matchId + '/result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            homeGoals: homeGoals,
            awayGoals: awayGoals,
            playerStats: playerStats
          })
        }).then(r => r.json()).then(res => {
          if(res.success || res.data || res.message) {
            window.location.reload();
          } else {
            alert('Error al registrar resultado: ' + (res.error || 'Desconocido'));
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

      async function openCreateMatchModal() {
        const homeSelect = document.getElementById('homeTeamSelect');
        const awaySelect = document.getElementById('awayTeamSelect');
        homeSelect.innerHTML = '<option value="">Cargando clubes...</option>';
        awaySelect.innerHTML = '<option value="">Cargando clubes...</option>';
        document.getElementById('createMatchModal').style.display = 'flex';

        try {
          const res = await fetch('/api/teams?categoryId=${categoryId}').then(r => r.json());
          if (res.teams && res.teams.length > 0) {
            const opts = res.teams.map(t => \`<option value="\${t.id}">\${t.name}</option>\`).join('');
            homeSelect.innerHTML = '<option value="">-- Selecciona Club Local --</option>' + opts;
            awaySelect.innerHTML = '<option value="">-- Selecciona Club Visitante --</option>' + opts;
          } else {
            homeSelect.innerHTML = '<option value="">No hay clubes en esta categoría</option>';
            awaySelect.innerHTML = '<option value="">No hay clubes en esta categoría</option>';
          }
        } catch(e) {
          console.error('Error al cargar clubes:', e);
        }
      }

      function closeCreateMatchModal() {
        document.getElementById('createMatchModal').style.display = 'none';
      }

      function submitCreateMatch(e) {
        e.preventDefault();
        const homeTeamId = document.getElementById('homeTeamSelect').value;
        const awayTeamId = document.getElementById('awayTeamSelect').value;
        const date = document.getElementById('matchDateInput').value;
        const venue = document.getElementById('matchVenueInput').value;

        if (!homeTeamId || !awayTeamId || homeTeamId === awayTeamId) {
          alert('Por favor selecciona dos clubes diferentes.');
          return;
        }

        fetch('/api/matches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            categoryId: '${categoryId}',
            homeTeamId,
            awayTeamId,
            date,
            venue
          })
        }).then(r => r.json()).then(res => {
          if (res.success || res.data) {
            window.location.reload();
          } else {
            alert('Error al programar partido: ' + (res.error || 'Desconocido'));
          }
        });
      }

      function deleteMatch(id) {
        if (confirm('¿Estás seguro de eliminar este partido?')) {
          fetch('/api/matches/' + id, { method: 'DELETE' })
            .then(r => r.json())
            .then(res => {
              if (res.success) {
                window.location.reload();
              } else {
                alert('Error al eliminar partido: ' + (res.error || 'Desconocido'));
              }
            });
        }
      }
    </script>

    <!-- MODAL CREAR PARTIDO -->
    <div id="createMatchModal" style="display: none; position: fixed; inset: 0; background: rgba(4, 7, 15, 0.88); backdrop-filter: blur(14px); z-index: 1000; align-items: center; justify-content: center; padding: 1.5rem;">
      <div class="card" style="max-width: 520px; width: 100%; border-color: #38bdf8; box-shadow: 0 25px 60px -12px rgba(0,0,0,0.8);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.8rem;">📅</span>
            <h3 style="font-size: 1.4rem; font-weight: 800; color: #fff; margin: 0;">Programar Nuevo Partido</h3>
          </div>
          <button type="button" onclick="closeCreateMatchModal()" style="background: transparent; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>

        <form onsubmit="submitCreateMatch(event)">
          <div style="margin-bottom: 1.25rem;">
            <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase;">Club Local *</label>
            <select id="homeTeamSelect" required style="width: 100%; padding: 0.85rem; border-radius: 12px; background: #0b0f19; border: 1px solid var(--border); color: #fff; font-size: 0.95rem; outline: none;"></select>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase;">Club Visitante *</label>
            <select id="awayTeamSelect" required style="width: 100%; padding: 0.85rem; border-radius: 12px; background: #0b0f19; border: 1px solid var(--border); color: #fff; font-size: 0.95rem; outline: none;"></select>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase;">Fecha y Hora *</label>
            <input type="datetime-local" id="matchDateInput" required style="width: 100%; padding: 0.85rem; border-radius: 12px; background: #0b0f19; border: 1px solid var(--border); color: #fff; font-size: 0.95rem; outline: none;">
          </div>

          <div style="margin-bottom: 1.75rem;">
            <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase;">Estadio / Cancha *</label>
            <input type="text" id="matchVenueInput" required placeholder="Ej: Estadio Nacional Chelato Uclés" value="Estadio Olímpico CONDEPOR" style="width: 100%; padding: 0.85rem; border-radius: 12px; background: #0b0f19; border: 1px solid var(--border); color: #fff; font-size: 0.95rem; outline: none;">
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
            <button type="button" onclick="closeCreateMatchModal()" class="btn btn-outline">Cancelar</button>
            <button type="submit" class="btn btn-primary" style="background: linear-gradient(135deg, #38bdf8, #0284c7); padding: 0.85rem 1.8rem;">
              <span>💾 Guardar Partido &rarr;</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  return await renderLayout("Partidos & Calendario", "matches", content, categoryId);
}
