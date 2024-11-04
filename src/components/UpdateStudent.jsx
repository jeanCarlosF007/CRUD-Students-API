import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function UpdateStudent() {

  const [fieldValues, setFieldValues] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getStudent();
  }, [])

  function getStudent() {
    axios.get(`http://localhost/api/${id}`)
      .then(response => {
        console.log(response.data)
        setFieldValues(response.data);
        console.log("FIELD: " + fieldValues);

      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFieldValues(values => ({ ...values, [name]: value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedValues = {
      ...fieldValues,
      id: id
    };

    axios.put(`http://localhost/api/${id}`, updatedValues)
      .then(response => {
        if (response.data.status === 1) {
          navigate('/students');
        } else {
          console.error('Failed to update:', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });;
    console.log(fieldValues);
  }

  return (
    <div>
      <h2>Editar Informações do Estudante</h2>
      <form type="submit" onSubmit={handleSubmit}>
        <label for="name">Name:
          <input type="text" name="name" id="name" value={fieldValues.name} onChange={handleChange} /></label>
        <br />
        <label for="email">Email:
          <input type="text" name="email" id="email" value={fieldValues.email} onChange={handleChange} /></label>
        <br />
        <label for="phone">Telefone:
          <input type="text" name="phone" id="phone" value={fieldValues.phone} onChange={handleChange} /></label>
        <br />
        <label for="address">Endereço:
          <input type="text" name="address" id="address" value={fieldValues.address} onChange={handleChange} /></label>
        <br />
        <label for="photo">Foto:
          <input type="text" name="photo" id="photo" value={fieldValues.photo} onChange={handleChange} /></label>
        <br />
        <button>Salvar</button>
      </form>
    </div>
  );
}

export default UpdateStudent;