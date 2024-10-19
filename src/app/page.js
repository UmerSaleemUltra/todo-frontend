"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave, faCheck, faUndo, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const API_URL = "http://localhost:3001/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTask, setEditingTask] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos", error);
    }
  };

  const addTodo = async () => {
    if (newTask.trim() === "") return;

    try {
      const response = await axios.post(API_URL, { task: newTask });
      setTodos([...todos, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding todo", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo", error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      await axios.put(`${API_URL}/complete/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("Error toggling todo", error);
    }
  };

  const startEditing = (id, task) => {
    setEditingId(id);
    setEditingTask(task);
  };

  const updateTodo = async () => {
    try {
      await axios.put(`${API_URL}/edit/${editingId}`, { task: editingTask });
      setEditingId(null);
      setEditingTask("");
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo", error);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-700 text-white p-6 md:p-8">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center tracking-wide text-gray-100">
        Todo App
      </h1>

      {/* Add new todo */}
      <div className="flex flex-col md:flex-row justify-center mb-6">
        <input
          type="text"
          className="border-none shadow-lg bg-gray-800 text-white p-4 rounded-lg w-full md:w-2/3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all mb-4 md:mb-0"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button
          onClick={addTodo}
          className="ml-0 md:ml-4 bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-500 transition-all shadow-lg flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add
        </button>
      </div>

      {/* List of todos */}
      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className={`flex flex-col md:flex-row justify-between items-center p-5 rounded-lg shadow-lg bg-gray-800  ${
              todo.completed ? "opacity-50" : ""
            }`}
          >
            {editingId === todo._id ? (
              <div className="flex items-center w-full">
                <input
                  type="text"
                  className="border-none bg-gray-700 text-white p-4 rounded-lg w-full md:w-2/3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  value={editingTask}
                  onChange={(e) => setEditingTask(e.target.value)}
                />
                <button
                  onClick={updateTodo}
                  className="ml-3 bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-all shadow-lg flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faSave} className="mr-2" /> Save
                </button>
              </div>
            ) : (
              <>
                <span
                  className={`flex-grow text-lg ${
                    todo.completed
                      ? "line-through text-gray-500"
                      : "text-white"
                  }`}
                >
                  {todo.task}
                </span>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
                  <button
                    onClick={() => toggleComplete(todo._id)}
                    className={`p-3 rounded-lg bg-transparent border ${
                      todo.completed
                        ? "text-orange-500 border-orange-500"
                        : "text-white border-white"
                    } hover:bg-orange-600 hover:border-orange-600 transition-all shadow-lg flex items-center justify-center`}
                  >
                    <FontAwesomeIcon icon={todo.completed ? faUndo : faCheck} className="mr-2" />
                    {todo.completed ? "Uncomplete" : "Complete"}
                  </button>
                  <button
                    onClick={() => startEditing(todo._id, todo.task)}
                    className="bg-transparent text-white py-3 px-5 rounded-lg border border-white hover:bg-orange-600 hover:border-orange-600 transition-all shadow-lg flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="bg-red-600 text-white py-3 px-5 rounded-lg hover:bg-red-500 transition-all shadow-lg flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} className="mr-2" /> Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
