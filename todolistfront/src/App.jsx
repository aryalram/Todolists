import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      setError('Error fetching tasks. Please try again later.');
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add or update a task
  const handleSubmit = async () => {
    if (!taskText || !taskDate) {
      setError('Please enter both task text and date.');
      return;
    }
    setError('');
    try {
      if (editingTask) {
        // Update task
        await axios.put(`http://localhost:5000/api/tasks/${editingTask.id}`, {
          text: taskText,
          date: taskDate,
        });
        setEditingTask(null); // Clear editing state
      } else {
        // Add new task
        await axios.post('http://localhost:5000/api/tasks', {
          text: taskText,
          date: taskDate,
        });
      }
      setTaskText('');
      setTaskDate('');
      fetchTasks(); // Refresh tasks
    } catch (error) {
      setError('Error adding or updating task. Please try again later.');
      console.error('Error adding or updating task:', error);
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`);
        fetchTasks(); // Refresh tasks
      } catch (error) {
        setError('Error deleting task. Please try again later.');
        console.error('Error deleting task:', error);
      }
    }
  };

  // Edit a task (populate fields with task data)
  const handleEditTask = (task) => {
    setTaskText(task.text);
    setTaskDate(task.date);
    setEditingTask(task);
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Task Manager</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>{error}</strong>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Enter task"
          style={{ marginRight: '10px', width: '60%' }}
        />
        <input
          type="date"
          value={taskDate}
          onChange={(e) => setTaskDate(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button onClick={handleSubmit}>
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
      </div>

      {isLoading ? (
        <div>Loading tasks...</div>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                borderBottom: '1px solid #ccc',
              }}
            >
              <span>
                <strong>{task.text}</strong> - {task.date}
              </span>
              <div>
                <button
                  onClick={() => handleEditTask(task)}
                  style={{
                    background: 'blue',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    marginRight: '10px',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  style={{
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {tasks.length === 0 && (
            <li style={{ textAlign: 'center', padding: '10px' }}>
              No tasks added yet.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default App;
