import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '../features/Home/Home'
import UsersList from '../features/Users/UsersList'

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UsersList />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
