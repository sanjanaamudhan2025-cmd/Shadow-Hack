import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import CourseViewer from './pages/CourseViewer'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '16px', borderBottom: '1px solid #ddd', display: 'flex', gap: '20px' }}>
        <Link to="/">Dashboard</Link>
        <Link to="/upload">Upload</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/course/:courseId" element={<CourseViewer />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App