import { useState, useContext } from "react";
import { AuthContext } from "../contex/AuthContext";
import { login } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    console.log("Login component rendered");
    const [form, setForm] = useState({ email: "", password: "" });
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Login attempt:", form);
        try {
            const res = await login(form);
            console.log("Login response:", res);
            if (res.token) {
                loginUser(res);
                navigate("/dashboard");
            } else {
                alert("Login failed: " + (res.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed: Network error");
        }
    };

    return (
        <div className="page">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
    );
}