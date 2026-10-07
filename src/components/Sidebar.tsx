import { ChevronRight, Layers3 } from 'lucide-react'
import { diagrams, levelLabels, type Level } from '../data/catalog'

export function Sidebar({
  activeId,
  onSelect,
  open,
  onClose,
}: {
  activeId: string
  onSelect: (id: string) => void
  open: boolean
  onClose: () => void
}) {
  const levels: Level[] = ['N0', 'N1', 'N2']
  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="sidebar-title">
        <span className="brand-icon"><Layers3 size={19} /></span>
        <div>
          <strong>Mapa del procedimiento</strong>
          <span>12 diagramas relacionados</span>
        </div>
        <button className="sidebar-close" onClick={onClose} aria-label="Cerrar navegación">×</button>
      </div>

      <nav className="process-nav">
        {levels.map((level) => (
          <section key={level} className="nav-level">
            <div className="nav-level-label">{levelLabels[level]}</div>
            {diagrams.filter((d) => d.level === level).map((diagram) => (
              <button
                type="button"
                key={diagram.id}
                className={`nav-item ${activeId === diagram.id ? 'active' : ''}`}
                onClick={() => { onSelect(diagram.id); onClose() }}
              >
                <span className={`level-chip ${diagram.group}`}>{diagram.id === 'n0' ? 'N0' : diagram.id}</span>
                <span className="nav-item-copy">
                  <strong>{diagram.shortTitle}</strong>
                  <small>{diagram.description}</small>
                </span>
                <ChevronRight size={16} className="nav-chevron" />
              </button>
            ))}
          </section>
        ))}
      </nav>
    </aside>
  )
}
