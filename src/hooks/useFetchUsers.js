// src/hooks/useFetchUsers.js
import { useState, useEffect } from 'react'
import { getUsersFromAPI } from '../services/UsersService'

export function useFetchUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const data = await getUsersFromAPI()
        setUsers(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { users, loading, error }
}
