import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import UploadPage from '../pages/UploadFileAndCaption/UploadFileAndCaption'

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
