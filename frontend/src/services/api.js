const API = "http://localhost:5000/api";

const handleResponse = async (res) => {
    const text = await res.text();
    let data = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            if (res.ok) {
                throw new Error("Invalid JSON response from server.");
            }
            throw new Error(text || `Server returned status ${res.status}`);
        }
    }

    if (!res.ok) {
        throw new Error(data?.message || text || `Request failed with status ${res.status}`);
    }

    return data;
};

export const register = (data) =>
    fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then(handleResponse);

export const login = (data) =>
    fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then(handleResponse);

export const saveResult = (token, data) => {
    console.log("saveResult request", `${API}/test/result`, data, token);
    return fetch(`${API}/test/result`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    }).then(handleResponse);
};

export const getHistory = (token) =>
    fetch(`${API}/test/history`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then(handleResponse);

export const getLeaderboard = () =>
    fetch(`${API}/test/leaderboard`).then(handleResponse);