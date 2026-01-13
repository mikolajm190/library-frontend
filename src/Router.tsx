import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import PageNotFound from './pages/PageNotFound'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './routes/ProtectedRoute'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
