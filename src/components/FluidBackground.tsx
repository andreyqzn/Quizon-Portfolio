import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function FluidBackground() {
  const { pathname } = useLocation()
  const [paused, setPaused] = useState(false)

  // Keep admin routes untouched — solid page background only.
  const hideOnAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    if (hideOnAdmin) return

    const syncVisibility = () => {
      setPaused(document.visibilityState === 'hidden')
    }

    syncVisibility()
    document.addEventListener('visibilitychange', syncVisibility)
    return () => document.removeEventListener('visibilitychange', syncVisibility)
  }, [hideOnAdmin])

  if (hideOnAdmin) return null

  return (
    <div className="fluid-bg" aria-hidden data-paused={paused ? 'true' : undefined}>
      <div className="fluid-bg__layer fluid-bg__blob--1" />
      <div className="fluid-bg__layer fluid-bg__blob--2" />
      <div className="fluid-bg__layer fluid-bg__blob--3" />
      <div className="fluid-bg__layer fluid-bg__caustic" />
      <div className="fluid-bg__layer fluid-bg__warm" />
      <div className="fluid-bg__layer fluid-bg__sun--1" />
      <div className="fluid-bg__layer fluid-bg__sun--2" />
      <div className="fluid-bg__layer fluid-bg__sheen--1" />
      <div className="fluid-bg__layer fluid-bg__sheen--2" />
      <div className="fluid-bg__noise" />
    </div>
  )
}
