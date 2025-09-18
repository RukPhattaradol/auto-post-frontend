import { useFetchUsers } from '../../hooks/useFetchUsers'

function UsersList() {
  const { users, loading, error } = useFetchUsers()

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h1>Users List</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  )
}

export default UsersList
