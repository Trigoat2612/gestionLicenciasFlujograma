import { useCallback, useMemo, useState } from 'react'
import {
  AlertTriangle, ArrowLeft, BookOpenCheck, Boxes, Expand, Menu, Search, ShieldCheck,
  Workflow, X, CheckCircle2, Database, UsersRound,
} from 'lucide-react'
import { BpmnViewer } from './components/BpmnViewer'
import { DetailPanel } from './components/DetailPanel'
import { Sidebar } from './components/Sidebar'
import { bpmnSources, parseBpmn, sanitizeBpmnXml, type BpmnNode } from './lib-bpmn'
import { diagrams, levelLabels, type DiagramDefinition } from './data/catalog'
import { pendingScenarios, procedure } from './data/procedure'

type ViewMode = 'flow' | 'overview' | 'pending'

type SearchHit = {
  diagram: DiagramDefinition
  node?: BpmnNode
  label: string
  sublabel: string
}

function diagramXml(diagram: DiagramDefinition) {
  return sanitizeBpmnXml(bpmnSources[diagram.fileKey] ?? '')
}

function App() {
  const [activeId, setActiveId] = useState('n0')
  const [selectedNodeId, setSelectedNodeId] = useState<string>()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mode, setMode] = useState<ViewMode>('flow')
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState<string[]>([])

  const activeDiagram = diagrams.find((d) => d.id === activeId) ?? diagrams[0]
  const xml = diagramXml(activeDiagram)
  const parsed = useMemo(() => parseBpmn(xml), [xml])
  const selectedNode = parsed.nodes.find((n) => n.id === selectedNodeId)

  const parsedAll = useMemo(() => diagrams.map((diagram) => ({
    diagram,
    parsed: parseBpmn(diagramXml(diagram)),
  })), [])

  const totalActivities = useMemo(() => parsedAll.reduce((sum, item) =>
    sum + item.parsed.nodes.filter((node) => ['task', 'sendTask', 'receiveTask', 'callActivity'].includes(node.type)).length, 0
  ), [parsedAll])

  const totalRoles = useMemo(() => new Set(parsedAll.flatMap((item) => item.parsed.lanes)).size, [parsedAll])

  const navigate = useCallback((id: string, remember = true) => {
    if (id === activeId) {
      setMode('flow')
      return
    }
    if (remember) setHistory((prev) => [...prev, activeId])
    setActiveId(id)
    setSelectedNodeId(undefined)
    setMode('flow')
    setQuery('')
  }, [activeId])

  const goBack = () => {
    const previous = history.at(-1)
    if (!previous) return
    setHistory((prev) => prev.slice(0, -1))
    setActiveId(previous)
    setSelectedNodeId(undefined)
    setMode('flow')
  }

  const onNodeSelect = useCallback((id: string) => setSelectedNodeId(id), [])

  const searchHits = useMemo<SearchHit[]>(() => {
    const normalized = query.trim().toLocaleLowerCase('es')
    if (!normalized) return []
    const hits: SearchHit[] = []
    for (const { diagram, parsed: model } of parsedAll) {
      if (`${diagram.id} ${diagram.title} ${diagram.description}`.toLocaleLowerCase('es').includes(normalized)) {
        hits.push({ diagram, label: diagram.title, sublabel: `${diagram.level} · Diagrama` })
      }
      for (const node of model.nodes) {
        if (`${node.code ?? ''} ${node.name} ${node.lane ?? ''}`.toLocaleLowerCase('es').includes(normalized)) {
          hits.push({
            diagram,
            node,
            label: node.name,
            sublabel: `${diagram.shortTitle}${node.lane ? ` · ${node.lane}` : ''}`,
          })
        }
      }
    }
    return hits.slice(0, 12)
  }, [parsedAll, query])

  const openSearchHit = (hit: SearchHit) => {
    if (hit.diagram.id !== activeId) {
      setHistory((prev) => [...prev, activeId])
      setActiveId(hit.diagram.id)
    }
    setMode('flow')
    setSelectedNodeId(hit.node?.id)
    setQuery('')
  }

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await document.documentElement.requestFullscreen()
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Abrir navegación">
          <Menu size={20} />
        </button>
        <div className="identity">
          <div className="identity-mark">PJ</div>
          <div>
            <strong>Programa EJE No Penal</strong>
            <span>Gestión integral de licencias · STEJENP</span>
          </div>
        </div>

        <div className="top-tabs" role="tablist">
          <button className={mode === 'flow' ? 'active' : ''} onClick={() => setMode('flow')}><Workflow size={16} /> Flujo</button>
          <button className={mode === 'overview' ? 'active' : ''} onClick={() => setMode('overview')}><Boxes size={16} /> Resumen</button>
          <button className={mode === 'pending' ? 'active' : ''} onClick={() => setMode('pending')}><AlertTriangle size={16} /> Por formalizar</button>
        </div>

        <div className="top-actions">
          <div className="search-box">
            <Search size={17} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar AL06, MO09, Softplan…" />
            {query && <button onClick={() => setQuery('')} aria-label="Limpiar búsqueda"><X size={15} /></button>}
            {query && (
              <div className="search-results">
                {searchHits.length ? searchHits.map((hit, index) => (
                  <button key={`${hit.diagram.id}-${hit.node?.id ?? 'diagram'}-${index}`} onClick={() => openSearchHit(hit)}>
                    <strong>{hit.label}</strong>
                    <span>{hit.sublabel}</span>
                  </button>
                )) : <div className="no-results">Sin coincidencias</div>}
              </div>
            )}
          </div>
          <button className="icon-button" onClick={toggleFullscreen} title="Modo presentación"><Expand size={19} /></button>
        </div>
      </header>

      <div className="workspace">
        <Sidebar activeId={activeId} onSelect={(id) => navigate(id)} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {sidebarOpen && <div className="sidebar-scrim" onClick={() => setSidebarOpen(false)} />}

        <main className="main-content">
          {mode === 'flow' && (
            <>
              <section className="diagram-header">
                <div className="breadcrumb-row">
                  {history.length > 0 && <button className="back-link" onClick={goBack}><ArrowLeft size={15} /> Volver</button>}
                  <span className={`level-badge ${activeDiagram.level.toLowerCase()}`}>{activeDiagram.level}</span>
                  <span>{levelLabels[activeDiagram.level]}</span>
                </div>
                <div className="diagram-title-row">
                  <div>
                    <h1>{activeDiagram.title}</h1>
                    <p>{activeDiagram.description}</p>
                  </div>
                  <div className="diagram-metrics">
                    <span><Workflow size={15} /> {parsed.nodes.length} elementos</span>
                    <span><UsersRound size={15} /> {parsed.lanes.length} carriles</span>
                  </div>
                </div>
              </section>

              <section className="viewer-layout">
                <BpmnViewer xml={xml} selectedNode={selectedNode} onNodeSelect={onNodeSelect} />
                <DetailPanel node={selectedNode} flows={parsed.flows} onOpenDiagram={(id) => navigate(id)} />
              </section>
            </>
          )}

          {mode === 'overview' && (
            <section className="overview-page">
              <div className="hero-card">
                <div className="hero-copy">
                  <span className="eyebrow">{procedure.version} · {procedure.date}</span>
                  <h1>{procedure.title}</h1>
                  <p>{procedure.objective}</p>
                  <button className="primary-action" onClick={() => navigate('n0', false)}><Workflow size={17} /> Explorar flujo integral</button>
                </div>
                <div className="hero-stats">
                  <div><strong>12</strong><span>diagramas</span></div>
                  <div><strong>{totalActivities}</strong><span>actividades</span></div>
                  <div><strong>{totalRoles}</strong><span>roles/carriles</span></div>
                </div>
              </div>

              <div className="overview-grid">
                <article className="info-card span-2">
                  <div className="card-heading"><Boxes size={18} /><h2>Arquitectura por niveles</h2></div>
                  <div className="level-map">
                    {(['N0', 'N1', 'N2'] as const).map((level) => (
                      <div className="level-column" key={level}>
                        <div className="level-column-title">{levelLabels[level]}</div>
                        {diagrams.filter((d) => d.level === level).map((diagram) => (
                          <button key={diagram.id} className="diagram-card" onClick={() => navigate(diagram.id, false)}>
                            <span className={`level-chip ${diagram.group}`}>{diagram.id === 'n0' ? 'N0' : diagram.id}</span>
                            <div><strong>{diagram.shortTitle}</strong><small>{diagram.description}</small></div>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </article>

                <article className="info-card">
                  <div className="card-heading"><ShieldCheck size={18} /><h2>Principios de control</h2></div>
                  <ul className="check-list">
                    {procedure.principles.map((item) => <li key={item}><CheckCircle2 size={15} /> {item}</li>)}
                  </ul>
                </article>

                <article className="info-card">
                  <div className="card-heading"><Database size={18} /><h2>Estados de licencia</h2></div>
                  <div className="tag-cloud">
                    {procedure.states.map((state) => <span key={state}>{state}</span>)}
                  </div>
                  <p className="muted-copy">Los estados de licencia son distintos de los estados de atención de una solicitud.</p>
                </article>

                <article className="info-card span-2">
                  <div className="card-heading"><BookOpenCheck size={18} /><h2>Alcance</h2></div>
                  <p>{procedure.scope}</p>
                  <div className="operation-strip">
                    {procedure.operationTypes.map((op) => <span key={op}>{op}</span>)}
                  </div>
                </article>
              </div>
            </section>
          )}

          {mode === 'pending' && (
            <section className="pending-page">
              <div className="section-intro">
                <span className="eyebrow">Control de versión</span>
                <h1>Aspectos pendientes de formalización</h1>
                <p>El procedimiento identifica estos puntos antes de aprobar la versión operativa. Se muestran aparte para no confundir el flujo vigente con decisiones todavía abiertas.</p>
              </div>
              <div className="pending-grid">
                {pendingScenarios.map((scenario, index) => (
                  <article className="pending-card" key={scenario.title}>
                    <span className="pending-number">{String(index + 1).padStart(2, '0')}</span>
                    <AlertTriangle size={20} />
                    <h2>{scenario.title}</h2>
                    <p>{scenario.detail}</p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
