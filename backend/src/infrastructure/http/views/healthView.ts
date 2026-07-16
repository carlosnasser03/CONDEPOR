import { renderLayout } from "./layout";

export async function renderHealthView(healthData: any, categoryId: string = ""): Promise<string> {
  const content = `
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem;">
      <div>
        <div class="badge badge-online" style="margin-bottom: 0.75rem;">❤️ MONITOREO DEL SISTEMA</div>
        <h1 style="font-size: 2.5rem; font-weight: 800; color: #fff;">Estado del Servidor & API</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; margin-top: 0.25rem;">
          Métricas en tiempo real, latencia y verificación de conexión a SQLite/Prisma.
        </p>
      </div>
      <a href="/api/health" onclick="fetchAndShowJson(event, '/api/health')" class="btn btn-outline">
        <span>📄 Ver JSON RAW</span>
      </a>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
      <div class="card" style="border-color: rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.05);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
          <span style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--accent);">Estado del Core</span>
          <span style="font-size: 1.5rem;">🟢</span>
        </div>
        <div style="font-size: 2.5rem; font-weight: 800; color: #fff; text-transform: uppercase;">${healthData.status || 'OK'}</div>
        <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.5rem;">Servidor Express escuchando en puerto 4000</div>
      </div>

      <div class="card">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
          <span style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: #60a5fa;">Entorno de Ejecución</span>
          <span style="font-size: 1.5rem;">⚙️</span>
        </div>
        <div style="font-size: 2.5rem; font-weight: 800; color: #fff; text-transform: capitalize;">${healthData.environment || 'development'}</div>
        <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.5rem;">Node.js con TypeScript Strict & tsconfig-paths</div>
      </div>

      <div class="card">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
          <span style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: #fbbf24;">Reloj del Servidor (UTC)</span>
          <span style="font-size: 1.5rem;">🕒</span>
        </div>
        <div style="font-size: 1.35rem; font-weight: 700; color: #fff; font-family: monospace;">${new Date(healthData.timestamp || Date.now()).toISOString()}</div>
        <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.5rem;">Sincronizado con base de datos SQLite</div>
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
  return await renderLayout("Estado del Servidor", "health", content, categoryId);
}
