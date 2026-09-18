import { applyFaultsFromQuery } from '@duxcasino/shared-api'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'

applyFaultsFromQuery(window.location.search)

const container = document.getElementById('root')
if (!container) throw new Error('Root container #root not found')

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
