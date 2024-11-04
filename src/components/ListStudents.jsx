import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ListStudents() {

  const [students, setStudents] = useState([]);

  useEffect(() => {
    getStudents();
  }, [])

  function getStudents() {
    axios.get('http://localhost/api/')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }

  function deleteStudent(id) {
    axios.delete(`http://localhost/api/${id}`).then((response) => {
      console.log(response.data);
      getStudents();
    })
  }

  return (
    <div>
      <h1>ListUsers</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th>Foto</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, key) =>
            <tr id={key}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.phone}</td>
              <td>{student.address}</td>
              <td>{student.photo}</td>
              <td>
                <Link to={`${student.id}/update`}>Edit</Link>
                <button onClick={() => deleteStudent(student.id)}>Delete</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListStudents;