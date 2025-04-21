import { useState, useEffect } from 'react';
import '../styles/EmployeeManagement.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    employeeName: '',
    age: '',
    clientName: '',
    department: '',
    email: '',
    role: 'EMPLOYEE', // Default role
    password: '',
    designation: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([fetchEmployees(), fetchClients()]);
      setLoading(false);
    };
    initializeData();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:8080/auth/client/all', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch clients');
      const data = await response.json();
      setClients(data);
    } catch (err) {
      setError('Failed to fetch clients: ' + err.message);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8080/auth/all/employee', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      setEmployees(data);
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
      const url = editingEmployee
        ? 'http://localhost:8080/auth/update/employee'
        : 'http://localhost:8080/auth/register/employee';
      
      const method = editingEmployee ? 'PUT' : 'POST';
      
      const employeeData = {
        eid: editingEmployee ? editingEmployee.eid : null,
        name: formData.employeeName,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age),
        clientName: formData.clientName,
        department: formData.department,
        designation: formData.designation,
        role: formData.role,
        hrId: editingEmployee ? editingEmployee.hrId : null  // Include hrId for updates
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        // Check if error is about existing employee
        if (errorText.includes("already exists")) {
          alert("An employee with this email already exists. Please use a different email address.");
          return;
        }
        
        throw new Error(errorText || `Failed to ${editingEmployee ? 'update' : 'add'} employee`);
      }

      // Show success message
      alert(editingEmployee ? 'Employee Updated Successfully' : 'Employee Registered Successfully');
      
      await fetchEmployees();
      setShowAddForm(false);
      setEditingEmployee(null);
      setFormData({
        employeeName: '',
        age: '',
        clientName: '',
        department: '',
        email: '',
        role: 'EMPLOYEE',
        password: '',
        designation: ''
      });
    } catch (err) {
      setError(err.message);
      // Only show alert for non-duplicate email errors
      if (!err.message.includes("already exists")) {
        alert(err.message);
      }
    }
  };

  const handleDelete = async (employeeId) => {
    try {
      const response = await fetch(`http://localhost:8080/auth/delete/employee/${employeeId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete employee');
      }
      
      alert('Employee Deleted Successfully');
      await fetchEmployees();
    } catch (err) {
      setError(err.message);
      alert(err.message);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      employeeName: employee.name,
      email: employee.email,
      role: employee.role,
      clientName: employee.clientName,
      department: employee.department,
      designation: employee.designation,
      age: employee.age,
      password: '' // Password field is empty during edit
    });
    setShowAddForm(true);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="employee-management">
      <div className="page-header">
        <h2>Employee Management</h2>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h3>Employee List</h3>
          <button className="add-employee-btn" onClick={() => {
            if (showAddForm) {
              setEditingEmployee(null);
              setFormData({
                employeeName: '',
                email: '',
                role: 'EMPLOYEE',
                clientName: '',
                department: '',
                designation: '',
                age: '',
                password: ''
              });
            }
            setShowAddForm(!showAddForm);
          }}>
            {showAddForm ? 'Cancel' : 'Add Employee'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="employee-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="employeeName">Employee Name</label>
                <input
                  type="text"
                  id="employeeName"
                  name="employeeName"
                  value={formData.employeeName}
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
                  required={!editingEmployee}
                />
              </div>
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="clientName">Client Name</label>
                <select
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.clientId} value={client.name}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="designation">Designation</label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
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
                  <option value="EMPLOYEE">EMPLOYEE</option>
                </select>
              </div>
            </div>
            <button type="submit" className="submit-btn">
              {editingEmployee ? 'Update Employee' : 'Add Employee'}
            </button>
          </form>
        )}

        <div className="employees-grid">
          {employees.map(employee => (
            <div key={employee.eid} className="employee-card"> {/* Changed from employeeId to eid */}
              <div className="employee-info">
                <h3>{employee.name}</h3> {/* Changed from employeeName to name */}
                <p className="position">{employee.role}</p>
                <p className="email">E-Mail: {employee.email}</p>
                <p className="client_name">Client Name: {employee.clientName}</p>
                <p className="age">Age: {employee.age}</p>
                <p className="designation">Designation: {employee.designation}</p>
                <p className="department">Department: {employee.department}</p>
              </div>
              <div className="card-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(employee)}
                >
                  <FaEdit /> Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(employee.eid)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;







