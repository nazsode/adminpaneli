import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

function UserList() {
  const [users, setUsers] = useState([]);
  const [chartData, setChartData] = useState({});

  // Memoize fetchUsers to avoid unnecessary re-renders
  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      updateChart(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []); // Dependencies here

  const updateChart = (users) => {
    const roles = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    setChartData({
      labels: Object.keys(roles),
      datasets: [{
        data: Object.values(roles),
        backgroundColor: ['#FF6384', '#36A2EB']
      }]
    });
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers(); // Fetch users again after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Include fetchUsers in the dependency array
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      <h1>User List</h1>
      <table>
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
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Bar data={chartData} />
    </div>
  );
}

export default UserList;
