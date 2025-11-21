import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RecordingPage from './pages/RecordingPage'
import MeetingsPage from './pages/MeetingsPage'
import MeetingDetailPage from './pages/MeetingDetailPage'
import MeetingSetupPage from './pages/MeetingSetupPage'
import DocumentsPage from './pages/DocumentsPage'
import Layout from './components/Layout'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/record" element={<RecordingPage />} />
          <Route path="/record/:id" element={<RecordingPage />} />
          <Route path="/meetings" element={<MeetingsPage />} />
          <Route path="/meetings/:id" element={<MeetingDetailPage />} />
          <Route path="/meetings/:id/setup" element={<MeetingSetupPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
