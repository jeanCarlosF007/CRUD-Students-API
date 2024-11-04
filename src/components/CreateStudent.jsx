import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateStudent() {

  const [fieldValues, setFieldValues] = useState({});
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

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
    formData.append('id', id);

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
          <input type="file" name="photo" id="photo" onChange={handleFileChange} /></label>
        <br />
        <button>Salvar</button>
      </form>
    </div>
  );
}

export default CreateStudent;