import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateStudent() {

  const [fieldValues, setFieldValue] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFieldValue(values => ({ ...values, [name]: value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost/api/', fieldValues)
      .then(response => {
        console.log('Response from server:', response.data);
        navigate('/students');
      })
      .catch(error => {
        console.error('Error:', error);
      });;
    console.log(fieldValues);
  }

  return (
    <div>
      <form type="submit" onSubmit={handleSubmit}>
        <label for="name">Name:
          <input type="text" name="name" id="name" onChange={handleChange} /></label>
        <br />
        <label for="email">Email:
          <input type="text" name="email" id="email" onChange={handleChange} /></label>
        <br />
        <label for="phone">Telefone:
          <input type="text" name="phone" id="phone" onChange={handleChange} /></label>
        <br />
        <label for="address">Endereço:
          <input type="text" name="address" id="address" onChange={handleChange} /></label>
        <br />
        <label for="photo">Foto:
          <input type="file" name="photo" id="photo" onChange={handleChange} /></label>
        <br />
        <button>Salvar</button>
      </form>
    </div>
  );
}

export default CreateStudent;