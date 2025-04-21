import { useState, useEffect } from 'react';
import '../styles/HRManagement.css';

const HRManagement = () => {
  const [hrs, setHRs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    hrName: '',
    email: '',
    password: '',
    role: 'HR',
    adminId: '' // Add this field
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHR, setEditingHR] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([fetchHRs()]);
      setLoading(false);
    };
    initializeData();
  }, []);

  const fetchHRs = async () => {
    try {
      const response = await fetch('http://localhost:8080/auth/admin/hrs', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch HRs');
      const data = await response.json();
      setHRs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingHR
        ? 'http://localhost:8080/auth/admin/update/hr'
        : 'http://localhost:8080/auth/admin/hrs';

      const method = editingHR ? 'PUT' : 'POST';

      // Create HR object matching the backend entity structure
      const hrData = {
        hrId: editingHR ? editingHR.hrId : null,
        name: formData.hrName,
        email: formData.email.toLowerCase(),
        password: formData.password,
        role: 'HR',
        adminId: parseInt(formData.adminId) // Make sure adminId is a number
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hrData),
        credentials: 'include'
      });

      // First try to parse as JSON, if that fails, get text
      let responseData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        // Check if the response is a string containing "already exists"
        if (typeof responseData === 'string' && responseData.includes("already exists")) {
          alert("An HR with this email already exists.");
          return;
        }
        throw new Error(responseData || `Failed to ${editingHR ? 'update' : 'add'} HR`);
      }

      alert(editingHR ? 'HR Updated Successfully' : 'HR Registered Successfully');

      await fetchHRs();
      setShowAddForm(false);
      setEditingHR(null);
      setFormData({
        hrName: '',
        email: '',
        role: 'HR',
        password: '',
        adminId: ''
      });
    } catch (err) {
      setError(err.message);
      if (!err.message.includes("already exists")) {
        alert(err.message);
      }
    }
  };

  const handleDelete = async (hr) => {
    try {
      const response = await fetch('http://localhost:8080/auth/admin/delete/hr', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hr),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete HR');
      }

      alert('HR Deleted Successfully');
      await fetchHRs();
    } catch (err) {
      setError(err.message);
      alert(err.message);
    }
  };

  const handleEdit = (hr) => {
    setEditingHR(hr);
    setFormData({
      hrName: hr.name,
      email: hr.email,
      role: hr.role,
      password: '', // keep password blank
      adminId: hr.adminId ? hr.adminId.toString() : '' // Ensure it's a string
    });
    setShowAddForm(true);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="employee-management">
      <div className="page-header">
        <h2>HR Management</h2>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h3>HR List</h3>
          <button className="add-employee-btn" onClick={() => {
            if (showAddForm) {
              setEditingHR(null);
              resetForm(); // Use the resetForm function
            }
            setShowAddForm(!showAddForm);
          }}>
            {showAddForm ? 'Cancel' : 'Add HR'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="employee-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="hrName">HR Name</label>
                <input
                  type="text"
                  id="hrName"
                  name="hrName"
                  value={formData.hrName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!editingHR}
                />
              </div>
              <div className="form-group">
                <label htmlFor="adminId">Admin ID</label>
                <input
                  type="number"
                  id="adminId"
                  name="adminId"
                  value={formData.adminId}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="HR">HR</option>
                </select>
              </div>
            </div>
            <button type="submit" className="submit-btn">
              {editingHR ? 'Update HR' : 'Add HR'}
            </button>
          </form>
        )}

        <div className="employees-grid">
          {hrs.map(hr => (
            <div key={hr.hrId} className="employee-card">
              <div className="employee-info">
                <h3>{hr.name}</h3>
                <p className="position">{hr.role}</p>
                <p className="email">E-Mail: {hr.email}</p>
              </div>
              <div className="card-actions">
                <button className="edit-btn" onClick={() => handleEdit(hr)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(hr)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HRManagement;
