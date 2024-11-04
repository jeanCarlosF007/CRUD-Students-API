import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function UpdateStudent() {

  const [fieldValues, setFieldValues] = useState({});
  const [photo, setPhoto] = useState(null);
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

    const formData = new FormData();
    Object.keys(fieldValues).forEach((key) => {
      formData.append(key, fieldValues[key]);
    });
    formData.append('photo', photo);
    formData.append('id', id);
    console.log(formData.id);
    

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

  return (
    <div>
      <h2>Editar Informações do Estudante</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:
          <input type="text" name="name" id="name" value={fieldValues.name} onChange={handleChange} /></label>
        <br />
        <label htmlFor="email">Email:
          <input type="text" name="email" id="email" value={fieldValues.email} onChange={handleChange} /></label>
        <br />
        <label htmlFor="phone">Telefone:
          <input type="text" name="phone" id="phone" value={fieldValues.phone} onChange={handleChange} /></label>
        <br />
        <label htmlFor="address">Endereço:
          <input type="text" name="address" id="address" value={fieldValues.address} onChange={handleChange} /></label>
        <br />
        <label htmlFor="photo">
          {fieldValues.photo && (
            <img src={`data:image/jpeg;base64,${fieldValues.photo}`} alt="Foto do Estudante" style={{ width: '100px', height: '100px' }} />
          )}
          <input type="file" name="photo" id="photo" onChange={handleFileChange} /> </label>
        <input type="text" name="id" id="id" value={fieldValues.id} hidden />
        <button>Salvar</button>
      </form>
    </div>
  );
}

export default UpdateStudent;