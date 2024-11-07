import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import validation from "../utils/validation";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 80vh;
  text-align: center;
  padding: 1rem 1rem;
`;

const Title = styled.h2`
  font-size: 3rem;
  margin-bottom: 20px;
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  justify-content: center;
  border-radius: 10%;
  margin: 0 auto;
  display: block;
  margin-bottom: 15px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px; 
  width: 100%;
  max-width: 400px;
`;

const Label = styled.label`
  font-size: 1.4rem;
  text-align: left;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 1.4rem;
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

function UpdateStudent() {

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
  const { id } = useParams();

  useEffect(() => {
    getStudent();
  }, [])

  function getStudent() {
    axios.get(`http://localhost/api/${id}`)
      .then(response => {
        setFieldValues(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }

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
      formData.append('id', id);
      formData.append('photo', photo);

      axios.put(`http://localhost/api/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          console.log(response.data);
          if (response.data.status === 1) {
            navigate('/students');
          } else {
            console.error('Failed to update:', response.data.message);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });;
    }
  }

  return (
    <Container>
      <Title>Editar Informações do(a) Estudante</Title>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="photo">
          {fieldValues.photo && (
            <Image src={`data:image/jpeg;base64,${fieldValues.photo}`} alt="Foto do Estudante" style={{ width: '100px', height: '100px' }} />
          )}
          <Input type="file" name="photo" id="photo" onChange={handleFileChange} />
        </Label>
        <Label htmlFor="name">Nome:
          <Input type="text" name="name" id="name" value={fieldValues.name} onChange={handleChange} required />
        </Label>
        {errors.name && <ErrorText>{errors.name}</ErrorText>}
        <Label htmlFor="email">Email:
          <Input type="text" name="email" id="email" value={fieldValues.email} onChange={handleChange} required />
        </Label>
        {errors.email && <ErrorText>{errors.email}</ErrorText>}
        <Label htmlFor="phone">Telefone:
          <Input type="text" name="phone" id="phone" value={fieldValues.phone} onChange={handleChange} required />
        </Label>
        {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
        <Label htmlFor="address">Endereço:
          <Input type="text" name="address" id="address" value={fieldValues.address} onChange={handleChange} required />
        </Label>
        {errors.address && <ErrorText>{errors.address}</ErrorText>}

        <Button>Salvar</Button>
      </Form>
    </Container>
  );
}

export default UpdateStudent;