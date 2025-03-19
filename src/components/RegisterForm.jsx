import React, { useState } from "react";
import { registerUser } from "../utils/api";

export default function RegisterForm() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirm_password: "",
    fullname: ""
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    // Validación de contraseñas
    if (form.password !== form.confirm_password) {
      setMessage({ text: "Las contraseñas no coinciden", type: "error" });
      return;
    }

    try {
      await registerUser(form);
      setMessage({
        text: "¡Registro exitoso! Redirigiendo a login...",
        type: "success"
      });
      
      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block font-medium">Nombre de usuario</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block font-medium">Nombre completo</label>
        <input
          type="text"
          name="fullname"
          value={form.fullname}
          onChange={handleChange}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block font-medium">Contraseña</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block font-medium">Confirmar contraseña</label>
        <input
          type="password"
          name="confirm_password"
          value={form.confirm_password}
          onChange={handleChange}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
      >
        Registrar
      </button>
      
      {message.text && (
        <div className={`p-3 rounded-lg ${
          message.type === "error" 
            ? "bg-red-100 text-red-700" 
            : "bg-green-100 text-green-700"
        }`}>
          {message.text}
        </div>
      )}
    </form>
  );
}