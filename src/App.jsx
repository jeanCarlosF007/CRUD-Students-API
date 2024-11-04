import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import Header from './components/Header'
import Footer from './components/Footer'
import CreateStudent from './components/CreateStudent'
import ListStudents from './components/ListStudents'
import UpdateStudent from './components/UpdateStudent'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <div className="App">

      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/">HOME</Link>
            </li>
            <li>
              <Link to="students">List Users</Link>
            </li>
            <li>
              <Link to="student/createstudent">Create User</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/students' element={<ListStudents />} />
          <Route path='/student/createstudent' element={<CreateStudent />} />
          <Route path="students/:id/update" element={<UpdateStudent />} />

        </Routes>
      </Router>
    </div>
  )
}

export default App
