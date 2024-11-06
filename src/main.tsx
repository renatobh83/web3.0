// import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { App } from './App.tsx'
import './index.css'

import AppTheme from './Theme/AppTheme.tsx'

const Root = () => {
  return (
    <AppTheme>
      <App />
    </AppTheme>
  )
}
// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <AuthProvider>
    <Router>
      <Root />
    </Router>
  </AuthProvider>
  //</StrictMode>
)
