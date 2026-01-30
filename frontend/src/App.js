import React, { useState, useEffect } from "react";

function App() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    fetch("/api/goals")
      .then(res => res.json())
      .then(data => setGoals(data));
  }, []);

  const addGoal = async () => {
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newGoal })
    });
    const data = await res.json();
    setGoals([...goals, data]);
    setNewGoal("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Goals App</h1>
      <input
        value={newGoal}
        onChange={e => setNewGoal(e.target.value)}
        placeholder="Enter a goal"
      />
      <button onClick={addGoal}>Add Goal</button>
      <ul>
        {goals.map((goal, i) => (
          <li key={i}>{goal.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

