import { renderLayout } from "./layout";

export async function renderAdminView(categoryId: string): Promise<string> {
  const content = `
    <div style="margin-bottom: 3rem;">
      <h1 style="font-size: 2.4rem; font-weight: 800; margin-bottom: 1rem; color: #fff;">
        ⚙️ Panel de Administración
      </h1>
      <p style="color: var(--text-muted); font-size: 1.05rem; margin-bottom: 2rem;">
        Gestiona jugadores, partidos y resultados desde aquí
      </p>
    </div>

    <!-- ==================== SECCIÓN PARTIDOS ==================== -->
    <div style="margin-bottom: 2.5rem;">
      <h2 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 1.5rem; color: #fff;">
        📅 Programar Partido
      </h2>

      <div class="card" style="max-width: 600px;">
        <form id="matchForm" style="display: flex; flex-direction: column; gap: 1.2rem;">
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text);">Equipo Local:</label>
            <input type="text" name="homeTeam" placeholder="Ej: CD Olimpia" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border); background: rgba(255,255,255,0.05); color: #fff; font-size: 0.95rem;">
          </div>

          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text);">Equipo Visitante:</label>
            <input type="text" name="awayTeam" placeholder="Ej: FC Motagua" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border); background: rgba(255,255,255,0.05); color: #fff; font-size: 0.95rem;">
          </div>

          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text);">Fecha y Hora:</label>
            <input type="datetime-local" name="date" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border); background: rgba(255,255,255,0.05); color: #fff; font-size: 0.95rem;">
          </div>

          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text);">Estadio/Venue:</label>
            <input type="text" name="venue" placeholder="Ej: Estadio Nacional" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border); background: rgba(255,255,255,0.05); color: #fff; font-size: 0.95rem;">
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 1rem;">
            ➕ Crear Partido
          </button>
        </form>
      </div>
    </div>

    <!-- ==================== SECCIÓN RESULTADOS ==================== -->
    <div style="margin-bottom: 2.5rem;">
      <h2 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 1.5rem; color: #fff;">
        🎯 Registrar Resultado
      </h2>

      <div class="card" style="max-width: 600px;">
        <form id="resultForm" style="display: flex; flex-direction: column; gap: 1.2rem;">
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text);">ID del Partido:</label>
            <input type="text" name="matchId" placeholder="cmrzd18c8003u117f88cy0026" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border); background: rgba(255,255,255,0.05); color: #fff; font-size: 0.95rem;">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text);">Goles Local:</label>
              <input type="number" name="homeGoals" min="0" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border); background: rgba(255,255,255,0.05); color: #fff; font-size: 0.95rem;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text);">Goles Visitante:</label>
              <input type="number" name="awayGoals" min="0" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border); background: rgba(255,255,255,0.05); color: #fff; font-size: 0.95rem;">
            </div>
          </div>

          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text);">Estado:</label>
            <select name="status" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border); background: rgba(255,255,255,0.05); color: #fff; font-size: 0.95rem;">
              <option value="scheduled">Programado</option>
              <option value="in_progress">En Progreso</option>
              <option value="finished">Terminado</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 1rem;">
            🎯 Registrar Resultado
          </button>
        </form>
      </div>
    </div>

    <!-- ==================== SECCIÓN JUGADORES ==================== -->
    <div style="margin-bottom: 2.5rem;">
      <h2 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 1.5rem; color: #fff;">
        ⚽ Agregar Jugador
      </h2>

      <div class="card" style="max-width: 600px;">
        <form id="playerForm" style="display: flex; flex-direction: column; gap: 1.2rem;">
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text);">Nombre del Jugador:</label>
            <input type="text" name="playerName" placeholder="Ej: Juan Pérez" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border); background: rgba(255,255,255,0.05); color: #fff; font-size: 0.95rem;">
          </div>

          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text);">Equipo:</label>
            <input type="text" name="teamName" placeholder="Ej: CD Olimpia" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border); background: rgba(255,255,255,0.05); color: #fff; font-size: 0.95rem;">
          </div>

          <div style="display: grid; template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text);">Posición:</label>
              <select name="position" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border); background: rgba(255,255,255,0.05); color: #fff; font-size: 0.95rem;">
                <option value="Delantero">Delantero</option>
                <option value="Medio">Medio</option>
                <option value="Defensa">Defensa</option>
                <option value="Portero">Portero</option>
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text);">Dorsal:</label>
              <input type="number" name="jerseyNumber" min="1" max="99" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border); background: rgba(255,255,255,0.05); color: #fff; font-size: 0.95rem;">
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 1rem;">
            ⚽ Agregar Jugador
          </button>
        </form>
      </div>
    </div>

    <script>
      // Enviar formulario de partido
      document.getElementById('matchForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
          const response = await fetch('/api/matches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              categoryId: '${categoryId}',
              homeTeamId: 'team-1', // Necesitarías obtener IDs reales
              awayTeamId: 'team-2',
              date: new Date(data.date).toISOString(),
              venue: data.venue
            })
          });

          if (response.ok) {
            alert('✅ Partido creado exitosamente');
            e.target.reset();
          } else {
            alert('❌ Error al crear el partido');
          }
        } catch (error) {
          alert('Error: ' + error.message);
        }
      });

      // Enviar formulario de resultado
      document.getElementById('resultForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
          const response = await fetch(\`/api/matches/\${data.matchId}/result\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              homeGoals: parseInt(data.homeGoals),
              awayGoals: parseInt(data.awayGoals),
              status: data.status
            })
          });

          if (response.ok) {
            alert('✅ Resultado registrado exitosamente');
            e.target.reset();
          } else {
            alert('❌ Error al registrar el resultado');
          }
        } catch (error) {
          alert('Error: ' + error.message);
        }
      });

      // Enviar formulario de jugador
      document.getElementById('playerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        alert('⚠️ Función en desarrollo. Necesita integración con endpoints de jugadores');
        e.target.reset();
      });
    </script>
  `;

  return await renderLayout("Panel de Administración", "admin", content, categoryId);
}
