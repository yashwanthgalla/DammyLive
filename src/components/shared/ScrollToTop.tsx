/**
 * ScrollToTop — Scrolls to top on every route change
 * Fixes React Router preserving scroll position across page navigations
 */

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
