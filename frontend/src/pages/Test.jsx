import { useState, useEffect } from "react";
import { saveResult } from "../services/api";
import { useNavigate } from "react-router-dom";

const paragraphs = {
    low: [
        "Typing fast requires daily consistent practice.",
        "JavaScript powers modern web applications.",
        "Accuracy matters more than speed at first."
    ],
    medium: [
        "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once.",
        "Programming is not just about writing code, but solving problems in an efficient and elegant way.",
        "React is a popular JavaScript library for building user interfaces, especially single-page applications."
    ],
    high: [
        "In computer science, algorithms are essential for processing data efficiently. Sorting algorithms like quicksort and mergesort have different time complexities. Understanding big O notation helps in analyzing performance.",
        "Machine learning involves training models on data to make predictions. Supervised learning uses labeled data, while unsupervised learning finds patterns in unlabeled data. Deep learning uses neural networks with multiple layers.",
        "Web development encompasses front-end and back-end technologies. HTML provides structure, CSS handles styling, and JavaScript adds interactivity. Frameworks like React, Angular, and Vue simplify the development process."
    ]
};

const levels = ['low', 'medium', 'high'];

const getRandomText = (level) =>
    paragraphs[level][Math.floor(Math.random() * paragraphs[level].length)];

export default function Test() {
    const [text, setText] = useState(getRandomText('low'));
    const [input, setInput] = useState("");
    const [time, setTime] = useState(60);
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [level, setLevel] = useState('low');
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setText(getRandomText(level));
    }, [level]);

    useEffect(() => {
        if (!started || finished) return;

        if (time <= 0) {
            setFinished(true);
            saveTestResult();
            return;
        }

        const timer = setTimeout(() => setTime((t) => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [started, time, finished]);

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    const startTest = () => {
        setInput("");
        setTime(60);
        setStarted(true);
        setFinished(false);
        setMessage("");
        setText(getRandomText(level));
    };

    const correctChars = input.split("").filter((c, i) => c === text[i]).length;
    const wpm = Math.round((correctChars / 5) / ((60 - time) / 60 || 1));
    const accuracy = Math.round((correctChars / input.length) * 100 || 0);

    const getCharColor = (index) => {
        if (index < input.length) {
            return input[index] === text[index] ? 'green' : 'red';
        }
        return 'black';
    };

    const renderText = () => {
        return text.split('').map((char, index) => (
            <span key={index} style={{ color: getCharColor(index) }}>
                {char}
            </span>
        ));
    };

    const stopTest = () => {
        setFinished(true);
        saveTestResult();
        nextLevel();
    };

    const restartTest = () => {
        setInput("");
        setTime(60);
        setStarted(false);
        setFinished(false);
        setMessage("");
        setText(getRandomText(level));
    };

    const nextLevel = () => {
        const currentIndex = levels.indexOf(level);
        if (currentIndex < levels.length - 1) {
            const next = levels[currentIndex + 1];
            setLevel(next);
            setInput("");
            setTime(60);
            setStarted(false);
            setFinished(false);
            setMessage("");
            setText(getRandomText(next));
        }
    };

    if (finished) {
        return (
            <div className="page">
                <h2>Test Completed!</h2>
                <p>Level: {level.charAt(0).toUpperCase() + level.slice(1)}</p>
                <p>WPM: {wpm}</p>
                <p>Accuracy: {accuracy}%</p>
                {message && <p style={{ color: message.includes('saved') ? 'green' : 'red' }}>{message}</p>}
                <button onClick={restartTest}>Restart</button>
                {level !== 'high' && <button onClick={nextLevel}>Next Level</button>}
                <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="page">
            <h2>Typing Speed Test</h2>
            <div style={{ margin: "10px 0", padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", background: "#f3faf7" }}>
                <p>Current level: <strong>{level.charAt(0).toUpperCase() + level.slice(1)}</strong></p>
                <p>Select your level, then click Start Test:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                    <button onClick={() => setLevel('low')} disabled={started} style={{ backgroundColor: level === 'low' ? '#60a5fa' : undefined }}>Low</button>
                    <button onClick={() => setLevel('medium')} disabled={started} style={{ backgroundColor: level === 'medium' ? '#60a5fa' : undefined }}>Medium</button>
                    <button onClick={() => setLevel('high')} disabled={started} style={{ backgroundColor: level === 'high' ? '#60a5fa' : undefined }}>High</button>
                </div>
                {!started ? (
                    <button onClick={startTest}>Start Test</button>
                ) : (
                    <button onClick={() => { setFinished(true); saveTestResult(); }}>Finish Test Now</button>
                )}
            </div>
            <p>Time remaining: {time} seconds</p>
            <div style={{ margin: "20px 0", padding: "10px", border: "1px solid #d1d5db", borderRadius: "8px", background: "#f9fafb" }}>
                <p style={{ fontSize: "1.1rem", lineHeight: "1.5", whiteSpace: "pre-wrap" }}>{renderText()}</p>
            </div>
            <textarea
                onChange={handleChange}
                value={input}
                placeholder={started ? "Start typing here..." : "Select a level and click Start Test"}
                disabled={!started || time === 0}
                style={{ minHeight: 120, width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
                <p>WPM: {wpm}</p>
                <p>Accuracy: {accuracy}%</p>
            </div>
            <div style={{ margin: "10px 0" }}>
                <button onClick={restartTest}>Restart</button>
                {started && !finished && <button onClick={stopTest}>Stop</button>}
            </div>
            {message && <p style={{ color: message.includes('saved') ? 'green' : 'red' }}>{message}</p>}
            <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
        </div>
    );
}
