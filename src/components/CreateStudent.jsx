import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  text-align: center;
  padding: 1rem;
`;

const Title = styled.h2`
  font-size: 2.6rem;
  font-weight: bold;
  text-align: center;
  margin-top: 10rem;
  margin-bottom: 2rem;
  color: #333;
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const Label = styled.label`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1.4rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 1.6rem;
  color: white;
  background-color: #00425a;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #002f3d;
  }
`;

function CreateStudent() {

  const [fieldValues, setFieldValues] = useState({});
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFieldValues((values) => ({ ...values, [name]: value }));
  }

  const handleFileChange = (event) => {
    setPhoto(event.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(fieldValues).forEach((key) => {
      formData.append(key, fieldValues[key]);
    });
    formData.append('photo', photo);

    axios.post('http://localhost/api/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        console.log('Response from server:', response.data);
        navigate('/students');
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  };

  return (
    <Container>
      <Title>Digite abaixo as informações do(a) estudante a ser cadastrado(a)</Title>
      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <Label htmlFor="name">Nome:</Label>
          <Input type="text" name="name" id="name" onChange={handleChange} />

          <Label htmlFor="email">Email:</Label>
          <Input type="text" name="email" id="email" onChange={handleChange} />

          <Label htmlFor="phone">Telefone:</Label>
          <Input type="text" name="phone" id="phone" onChange={handleChange} />

          <Label htmlFor="address">Endereço:</Label>
          <Input type="text" name="address" id="address" onChange={handleChange} />

          <Label htmlFor="photo">Foto:</Label>
          <Input type="file" name="photo" id="photo" onChange={handleFileChange} />

          <Button type="submit">Salvar</Button>
        </Form>
      </FormContainer>
    </Container>
  );
}

export default CreateStudent;