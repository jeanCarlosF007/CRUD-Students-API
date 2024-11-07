import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import validation from "../utils/validation";

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

const ErrorText = styled.p`
  color: red;
  font-size: 1.2rem;
  margin-top: 0.2rem;
`;

function CreateStudent() {

  const [fieldValues, setFieldValues] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    photo: null
  });
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
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

    const newErrors = {};

    if (!validation.verifyNameLength(fieldValues.name)) {
      newErrors.name = "O nome deve ter pelo menos 8 caracteres.";
    }

    if (!validation.isValidEmail(fieldValues.email)) {
      newErrors.email = "O e-mail fornecido não é válido.";
    }

    if (!validation.isValidPhoneNumber(fieldValues.phone)) {
      newErrors.phone = "Informe um telefone válido.";
    }

    if (!validation.isValidAddress(fieldValues.address)) {
      newErrors.address = "Informe um endereço válido.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
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
    } 
  };

  return (
    <Container>
      <Title>Digite abaixo as informações do(a) estudante a ser cadastrado(a)</Title>
      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <Label htmlFor="name">Nome:
          <Input type="text" name="name" id="name" onChange={handleChange} required />
          </Label>
          {errors.name && <ErrorText>{errors.name}</ErrorText>}

          <Label htmlFor="email">Email:
          <Input type="text" name="email" id="email" onChange={handleChange} required />
          </Label>
          {errors.email && <ErrorText>{errors.email}</ErrorText>}
          <Label htmlFor="phone">Telefone:
          <Input type="text" name="phone" id="phone" onChange={handleChange} required />
          {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
          </Label>
          <Label htmlFor="address">Endereço:
          <Input type="text" name="address" id="address" onChange={handleChange} required />
          {errors.address && <ErrorText>{errors.address}</ErrorText>}
          </Label>
          <Label htmlFor="photo">Foto:
          <Input type="file" name="photo" id="photo" onChange={handleFileChange} required />
          {errors.photo && <ErrorText>{errors.photo}</ErrorText>}
          </Label>

          <Button type="submit">Salvar</Button>
        </Form>
      </FormContainer>
    </Container>
  );
}

export default CreateStudent;