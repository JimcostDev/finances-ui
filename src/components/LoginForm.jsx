import React, { useState } from "react";
import { loginUser } from "../utils/api";

export default function LoginForm() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const data = await loginUser(credentials);
      setMessage("Inicio de sesión exitoso");
      // Aquí podrías guardar el token en localStorage o en un contexto global
      localStorage.setItem("token", data.token);
      console.log("Token recibido:", data.token);
      // Redirige al usuario a la página de reportes
      window.location.href = "/reports";
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Password</label>
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">
        Iniciar Sesión
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
