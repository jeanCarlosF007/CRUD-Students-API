import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const MainTitle = styled.h1`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;


const TableHeader = styled.thead`
  background-color: #00425a;
  color: white;
  text-align: left;
`;

const TableBody = styled.tbody`
  text-align: left;
  background-color: #f9f9f9;
`;

const Tr = styled.tr`
  border-bottom: 1px solid #ccc;
`;

const Th = styled.th`
  padding: 15px;
  font-size: 1.6rem;
  font-weight: bold;
  text-align: center;
`;

const Td = styled.td`
  padding: 12px;
  text-align: center;
  font-size: 1.4rem;
  color: #333;
`;

const Img = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10%;
  object-fit: cover;
`;

const Edit = styled(Link)`
  padding: 8px 15px;
  font-size: 1.4rem;
  margin-right: 5px;
  color: white;
  background-color: #28a745;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none; 
  transition: background-color 0.3s;
  &:hover {
    background-color: #218838;
  }
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  font-size: 1.4rem;
  color: white;
  background-color: #ff4d4d;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #e60000;
  }
`;

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
    <Container>
      <MainTitle>Lista de alunos(as)</MainTitle>
      <Table>
        <TableHeader>
          <Tr>
            <Th>ID</Th>
            <Th>Nome</Th>
            <Th>Email</Th>
            <Th>Telefone</Th>
            <Th>Endereço</Th>
            <Th colSpan='3'></Th>
          </Tr>
        </TableHeader>
        <TableBody>
          {students.map((student, key) =>
            <Tr key={key}>
              <Td>{student.id}</Td>
              <Td>{student.name}</Td>
              <Td>{student.email}</Td>
              <Td>{student.phone}</Td>
              <Td>{student.address}</Td>
              <Td>{student.photo && (
                <Img src={`data:image/jpeg;base64,${student.photo}`} alt="Student" style={{ width: '100px', height: '100px' }} />
              )}</Td>
              <Td>
                <Edit to={`${student.id}/update`}>Edit</Edit>
                <Button onClick={() => deleteStudent(student.id)}>Delete</Button>
              </Td>
            </Tr>
          )}
        </TableBody>
      </Table>
    </Container>
  );
}

export default ListStudents;