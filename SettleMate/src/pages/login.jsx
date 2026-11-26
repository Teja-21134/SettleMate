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
      const { data } = await api.post("/api/auth/login", {
        username,
        password,
      });

      sessionStorage.setItem("settlemateToken", data.token);
      localStorage.setItem("loggedInUser", data.username);
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Unable to sign in. Please try again."
      );
    }
  };
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-600">
            SettleMate
          </h1>

          <p className="text-gray-500 mt-2">
            Vendor Settlement Management
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-2 font-medium">
              Username
            </label>

            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
          </div>

          {errorMessage && (
            <p className="mb-5 text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;