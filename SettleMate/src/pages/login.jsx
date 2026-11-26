import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const { data } = await api.post("/api/auth/login", { username, password });
      sessionStorage.setItem("settlemateToken", data.token);
      localStorage.setItem("loggedInUser", data.username);
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to sign in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-600">SettleMate</h1>
          <p className="text-gray-500 mt-2">Vendor Settlement Management</p>
        </div>
        <div className="mb-6 rounded-lg bg-amber-50 p-3 text-sm text-amber-900" role="note">
          GitHub Pages demo: sign in with <strong>guest</strong> / <strong>guest@123</strong>.
          Demo entries are saved only in this browser and do not sync across devices.
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="username" className="block mb-2 font-medium">Username</label>
            <input id="username" type="text" autoComplete="username" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border rounded-lg p-3" required />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 font-medium">Password</label>
            <input id="password" type="password" autoComplete="current-password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg p-3" required />
          </div>
          {errorMessage && <p className="mb-5 text-sm text-red-600" role="alert">{errorMessage}</p>}
          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
