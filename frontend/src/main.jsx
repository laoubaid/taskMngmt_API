import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const DomNode = document.getElementById('root')
createRoot(DomNode).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
