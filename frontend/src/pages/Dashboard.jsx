import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contex/AuthContext";
import { useNavigate } from "react-router-dom";
import { getHistory } from "../services/api";

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (!user) navigate("/login");
        else {
            const token = localStorage.getItem("token");
            getHistory(token).then(setResults);
        }
    }, [user, navigate]);

    return (
        <div className="page" style={{ backgroundColor: '#e0f7fa' }}>
            <h2>Dashboard</h2>
            <p>Welcome, {user?.username}</p>
            <button onClick={() => navigate("/test")}>Start Test</button>
            <button onClick={logout}>Logout</button>
            { <h3>Your Results</h3> }
            <ul>
                {results.length === 0 ? (
                     <li>No results yet. Take a test!</li>
                ) : (
                    results.map((result, index) => (
                        <li key={index}>
                            Level: {result.level}, WPM: {result.wpm}, Accuracy: {result.accuracy}% - {new Date(result.date).toLocaleDateString()}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}