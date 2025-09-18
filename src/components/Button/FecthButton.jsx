import './FecthButton.css'
import { useState } from 'react'
import { useFetchUsers } from '../../hooks/useFetchUsers'

function FecthButton({ text = 'Fetch Users' }) {
  const { users, loading, error } = useFetchUsers()
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    setClicked(true)
    console.log('Users:', users)
    if (error) console.error(error)
  }

  return (
    <button className="btn" onClick={handleClick}>
      {loading ? 'Loading...' : clicked ? `Fetched ${users.length} users` : text}
    </button>
  )
}

export default FecthButton
