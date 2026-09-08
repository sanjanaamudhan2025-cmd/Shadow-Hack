import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import CourseViewer from './pages/CourseViewer';
import Login from './pages/Login';
import Register from './pages/Register';
import Quiz from './pages/Quiz';
import Profile from './pages/Profile';
import Flashcards from './pages/Flashcards';
import StudyGuide from './pages/StudyGuide';
import ChatBot from './pages/ChatBot';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Sidebar>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
              <Route path="/course/:id" element={<ProtectedRoute><CourseViewer /></ProtectedRoute>} />
              <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
              <Route path="/flashcards" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
              <Route path="/study-guide" element={<ProtectedRoute><StudyGuide /></ProtectedRoute>} />
              <Route path="/chatbot" element={<ProtectedRoute><ChatBot /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Sidebar>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}