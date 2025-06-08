// components/NotiForm.js
import { useState } from 'react';

const NotiForm = ({ onSubmit, error, successMessage }) => {
  const [noti, setNoti] = useState({ titulo: '', text: '' });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNoti((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(noti);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <p className="date">{new Date().toLocaleDateString()}</p>
      <input
        placeholder="Titulo"
        className="authorInput"
        maxLength="40"
        type="text"
        name="titulo"
        value={noti.titulo}
        onChange={handleChange}
      />
      <textarea
        className="textArea"
        placeholder="Añade un notiio.."
        maxLength="9999999"
        type="text"
        name="text"
        value={noti.text}
        onChange={handleChange}
      />
      <button className="button" type="submit">
        Send
      </button>
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
    </form>
  );
};

export default NotiForm;