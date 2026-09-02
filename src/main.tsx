import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { CollectionProvider } from './state/collection'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CollectionProvider>
      <App />
    </CollectionProvider>
  </StrictMode>,
)
