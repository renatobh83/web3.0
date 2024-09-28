import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { App } from './App.tsx'
import './index.css'

import AppTheme from './Theme/AppTheme.tsx'
import { Box } from '@mui/material'

const Root = () => {
  return (
    <AppTheme>
      <App />
    </AppTheme>
  )
}
createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <Suspense fallback={<Box>carregados..</Box>}>
    <AuthProvider>
      <Router>
        <Root />
      </Router>
    </AuthProvider>
  </Suspense>
  //</StrictMode>
)
