import * as React from 'react'
import { useMemo, useState } from 'react'

type DemoModule = { default?: React.ComponentType }
const modules = import.meta.glob<DemoModule>('./demos/**/*.tsx', { eager: true })

interface Entry {
  path: string
  group: string
  name: string
  Component: React.ComponentType
}

const entries: Entry[] = Object.entries(modules)
  .flatMap(([path, mod]) => {
    const Component = (mod?.default ?? Object.values(mod ?? {}).find((v) => typeof v === 'function')) as
      | React.ComponentType
      | undefined
    if (!Component) return []
    const rel = path.replace(/^\.\/demos\//, '')
    const parts = rel.split('/')
    return [
      {
        path: rel,
        group: parts.length > 1 ? parts[0] : 'misc',
        name: parts[parts.length - 1].replace(/\.tsx$/, ''),
        Component,
      },
    ]
  })
  .sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name))

class DemoBoundary extends React.Component<{ children: React.ReactNode }, { error: string | null }> {
  state: { error: string | null } = { error: null }
  static getDerivedStateFromError(error: unknown) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
  render() {
    if (this.state.error) {
      return <p className='ui-gallery-fail'>Failed to render: {this.state.error}</p>
    }
    return this.props.children
  }
}

export function UiGallery() {
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q
      ? entries.filter((e) => `${e.group} ${e.name}`.toLowerCase().includes(q))
      : entries
    const out: { group: string; items: Entry[] }[] = []
    for (const entry of filtered) {
      const last = out[out.length - 1]
      if (last && last.group === entry.group) last.items.push(entry)
      else out.push({ group: entry.group, items: [entry] })
    }
    return out
  }, [query])

  const total = groups.reduce((n, g) => n + g.items.length, 0)

  return (
    <div className='ui-gallery'>
      <header className='ui-gallery-head'>
        <p className='ui-gallery-eyebrow'>ui-layouts.com · ported library</p>
        <h1>Component gallery</h1>
        <p className='ui-gallery-sub'>
          {entries.length} live components across {groups.length} groups, adapted to this project&apos;s
          React 19 + Tailwind 3.4 stack. Import them from <code>src/components/ui</code>.
        </p>
        <input
          className='ui-gallery-search'
          type='search'
          placeholder='Filter components…'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </header>

      {total === 0 && <p className='ui-gallery-empty'>No components match “{query}”.</p>}

      {groups.map(({ group, items }) => (
        <section key={group} className='ui-gallery-group'>
          <h2>
            {group} <span>{items.length}</span>
          </h2>
          <div className='ui-gallery-grid'>
            {items.map(({ path, name, Component }) => (
              <article key={path} className='ui-gallery-card'>
                <div className='ui-gallery-card-head'>
                  <span>{name}</span>
                  <code>{path}</code>
                </div>
                <div className='ui-gallery-demo'>
                  <DemoBoundary>
                    <Component />
                  </DemoBoundary>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default UiGallery
