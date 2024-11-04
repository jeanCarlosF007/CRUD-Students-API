import { Navigate } from 'react-router-dom'
import ListUsers from './ListStudents'
import CreateUser from './CreateStudent'

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/ListUsers" />
  }

  return <Navigate to="CreateUser" />
}

export default ProtectedRoute;