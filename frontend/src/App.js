import React, { useState, useEffect } from "react";

function App() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");

  // Fetch all goals from backend
  const fetchGoals = async () => {
    try {
      const res = await fetch("/api/goals");
      const data = await res.json();
      setGoals(data);
    } catch (err) {
      console.error("Error fetching goals:", err);
    }
  };

  // Load goals on mount
  useEffect(() => {
    fetchGoals();
  }, []);

  // Add a new goal
  const addGoal = async () => {
    if (!newGoal.trim()) return;
    try {
      await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newGoal })
      });

      setNewGoal("");

      // ✅ Always refresh the list from backend
      fetchGoals();
    } catch (err) {
      console.error("Error adding goal:", err);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Goals App</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          value={newGoal}
          onChange={e => setNewGoal(e.target.value)}
          placeholder="Enter a goal"
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={addGoal} style={{ padding: "5px 10px" }}>
          Add Goal
        </button>
      </div>

      <h2>My Goals</h2>
      <ul>
        {goals.map(goal => (
          <li key={goal._id}>{goal.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
