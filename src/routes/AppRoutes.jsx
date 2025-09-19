import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import UploadPage from '../pages/UploadFileAndCaption/UploadFileAndCaption'
import PostPage from '../pages/Post/Post'
import TestAPI from '../pages/TestAPI/TestAPI'
import Groups from '../pages/Groups/Groups'

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/test-api" element={<TestAPI />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
