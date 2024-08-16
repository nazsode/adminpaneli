import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './Dashboard.css'; // Make sure to create this CSS file for styling

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [error, setError] = useState(null);
  const [tokenPresent, setTokenPresent] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setTokenPresent(false);
          return;
        }

        const userResponse = await axios.get('http://localhost:5000/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(userResponse.data);

        const usersResponse = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsersList(usersResponse.data);

        setTokenPresent(true);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
        setError(error.response?.data.message || error.message);
        setUserData(null);
        setUsersList([]);
      }
    };

    fetchUserData();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsersList(usersList.filter(user => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error.response?.data || error.message);
    }
  };

  const roleDistributionData = {
    labels: ['Admin', 'User'],
    datasets: [
      {
        data: [
          usersList.filter(user => user.role === 'admin').length,
          usersList.filter(user => user.role === 'user').length,
        ],
        backgroundColor: ['#311fff', '#6bff26'],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Your Dashboard</h1>
      {!tokenPresent && <p className="error-message">No token found in localStorage. Please log in.</p>}
      {error && <p className="error-message">Error: {error}</p>}
      {userData ? (
        <div>
          <div className="user-info">
            <h2>Welcome, {userData.name}</h2>
            <p>Email: {userData.email}</p>
            <p>Role: {userData.role}</p>
            <p>Status: {userData.status}</p>
          </div>
          <h3>User Management</h3>
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>
                    <button className="delete-button" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>User Role Distribution</h3>
          <div className="chart-container">
            <Pie data={roleDistributionData} />
          </div>
        </div>
      ) : tokenPresent && !error ? (
        <p>Loading...</p>
      ) : null}
    </div>
  );
}

export default Dashboard;
