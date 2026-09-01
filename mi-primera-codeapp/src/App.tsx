import { useState, useEffect } from 'react';
import { Cra58_tareasService } from './generated/services/Cra58_tareasService';
import type { Cra58_tareas } from './generated/models/Cra58_tareasModel';
import {
  Cra58_tareascra58_estado,
  Cra58_tareascra58_prioridad,
} from './generated/models/Cra58_tareasModel';
import { LISTADODEWIKISService } from './generated/services/LISTADODEWIKISService';
import type { LISTADODEWIKISRead } from './generated/models/LISTADODEWIKISModel';

function App() {
  const [tareas, setTareas] = useState<Cra58_tareas[]>([]);
  const [wikis, setWikis] = useState<LISTADODEWIKISRead[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
  const [resTareas, resWikis] = await Promise.all([
    Cra58_tareasService.getAll(),
    LISTADODEWIKISService.getAll(),
  ]);
  console.log('WIKIS resultado completo:', resWikis);
  console.log('WIKIS success:', resWikis.success);
  console.log('WIKIS data:', resWikis.data);
  if (resTareas.success) setTareas(resTareas.data);
  if (resWikis.success) setWikis(resWikis.data);
  setCargando(false);
}
    cargarDatos();
  }, []);

  if (cargando) {
    return <p style={{ padding: 20 }}>Cargando datos...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Mis Tareas</h1>
      {tareas.length === 0 ? (
        <p>No hay tareas todavía.</p>
      ) : (
        <ul>
          {tareas.map((t) => (
            <li key={t.cra58_tareaid}>
              <strong>{t.cra58_titulo}</strong>
              {" — "}
              {t.cra58_estado != null
                ? Cra58_tareascra58_estado[t.cra58_estado]
                : "sin estado"}
              {" / "}
              {t.cra58_prioridad != null
                ? Cra58_tareascra58_prioridad[t.cra58_prioridad]
                : "sin prioridad"}
            </li>
          ))}
        </ul>
      )}

      <h1 style={{ marginTop: 32 }}>Wikis</h1>
      {wikis.length === 0 ? (
        <p>No hay wikis.</p>
      ) : (
        <ul>
          {wikis
            .filter((w) => w.Eliminado !== true)
            .map((w) => (
              <li key={w.ID}>
                <strong>{w.Title}</strong>
                {" — "}
                {w.Estado?.Value ?? "sin estado"}
                {w.GeneradaPor?.DisplayName
                  ? ` (por ${w.GeneradaPor.DisplayName})`
                  : ""}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default App;