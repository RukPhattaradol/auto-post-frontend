import './Home.css'
import FecthButton from '../../components/Button/FecthButton'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate(); // เรียก useNavigate ตรงนี้

  return (
    <div className="home">
      <h1>Welcome to Home Page</h1>
      <FecthButton></FecthButton>
      <button onClick={() => navigate('/users')}>Click Na Kub</button>
    </div>
  )
}

export default Home
