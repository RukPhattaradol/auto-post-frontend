import User from '../models/user'

const API_URL = import.meta.env.VITE_API_URL

export async function getUsersFromAPI() {
  try {
    const response = await fetch(`${API_URL}/users`) // ใช้ URL ที่ถูกต้อง
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    
    const data = await response.json()
    const users = Array.isArray(data) ? data : [data]
    return users.map(user => new User(user))
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return []
  }
}
