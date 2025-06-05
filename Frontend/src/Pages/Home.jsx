import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask, deleteTask, updateTask } from '../redux/actions/todoAction';
import {logout} from '../redux/actions/authAction';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tasks, loading } = useSelector((state) => state.todo);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');
  useEffect(()=>{
    if(!token){
      navigate('/');
    }
  },[token, navigate]);
  // Logout handler (direct API call, not redux)
  const handleLogout =()=>{
    dispatch(logout());
  };

  // Add task
  const submitHandler = (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError('Please fill in all fields');
      setTimeout(() => setError(''), 3000);
      return;
    }
    dispatch(addTask(title, description));
    dispatch(fetchTasks());
    setTitle('');
    setDescription('');
  };

  // Fetch tasks on mount
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Delete task
  const handleDelete = (e, ind) => {
    e.preventDefault();
    const taskId = tasks[ind]._id;
    dispatch(deleteTask(taskId));
  };

  // Edit task popup logic
  const handleEdit = (e, ind) => {
    e.preventDefault();
    setEditIndex(ind);
    setEditTitle(tasks[ind].title);
    setEditDescription(tasks[ind].description);
  };

  const handleEditSave = () => {
    const taskId = tasks[editIndex]._id;
    dispatch(updateTask(taskId, editTitle, editDescription));
    setEditIndex(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleEditCancel = () => {
    setEditIndex(null);
    setEditTitle('');
    setEditDescription('');
  };
  const disabled = loading || !title.trim() || !description.trim();

  return (
    <div className="home-main">
      <div className="home-nav">
        <h1>To-do list</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      <div className="home-content">
        <div className="form-container">
          <form className="form-content" onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <button
              type="submit"
              disabled={disabled}
              style={{
                backgroundColor:
                  loading || !title.trim() || !description.trim()
                    ? '#ccc'
                    : '#007bff',
                color: '#fff',
                cursor:
                  loading || !title.trim() || !description.trim()
                    ? 'not-allowed'
                    : 'pointer'
              }}
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>
        {error && <p className='error'>{error}</p>}
        <div className="tasks-container">
          {loading ? (
            <p>Loading...</p>
          ) : tasks.length > 0 ? (
            tasks.map((task, ind) => (
              <div className="task" key={task._id}>
                <div className="task-content">
                  <h2>{task.title}</h2>
                  <p>{task.description}</p>
                  <p>{task.created_at}</p>
                </div>
                <div className="task-btns">
                  <button onClick={(e) => handleEdit(e, ind)} title="Edit">
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button onClick={(e) => handleDelete(e, ind)} title="Delete">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
                {/* Edit Popup */}
               {editIndex === ind && (
              <div className="edit-popup-overlay">
                <div className="edit-popup-box">
                  <h3>Edit Task</h3>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Title"
                    className="edit-input"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description"
                    className="edit-textarea"
                  />
                  <div className="edit-popup-btns">
                    <button className="edit-save-btn" onClick={handleEditSave}>Save</button>
                    <button className="edit-cancel-btn" onClick={handleEditCancel}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
              </div>
            ))
          ) : (
            <p className="no-tasks">No tasks available...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;