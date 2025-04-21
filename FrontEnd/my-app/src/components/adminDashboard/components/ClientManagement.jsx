import { useState, useEffect } from 'react';
import '../styles/ClientManagement.css';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    spocName: '',
    spocPno: '',
    totalHolidays: 0
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:8000/cs/client/clients', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch clients');
      const data = await response.json();
      setClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      spocName: '',
      spocPno: '',
      totalHolidays: 0
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalHolidays' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingClient
        ? 'http://localhost:8000/cs/client/update-client'
        : 'http://localhost:8000/cs/client/register-client';

      const method = editingClient ? 'PUT' : 'POST';

      const clientData = {
        clientId: editingClient ? editingClient.clientId : null,
        ...formData
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `Failed to ${editingClient ? 'update' : 'add'} client`);
      }

      alert(editingClient ? 'Client Updated Successfully' : 'Client Added Successfully');
      await fetchClients();
      setShowAddForm(false);
      setEditingClient(null);
      resetForm();
    } catch (err) {
      setError(err.message);
      alert(err.message);
    }
  };

  const handleDelete = async (client) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    try {
      const response = await fetch('http://localhost:8080/admin/delete-client', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(client), // Send the entire client object
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete client');
      }

      alert('Client Deleted Successfully');
      await fetchClients();
    } catch (err) {
      setError(err.message);
      alert(err.message);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      description: client.description,
      spocName: client.spocName,
      spocPno: client.spocPno,
      totalHolidays: client.totalHolidays
    });
    setShowAddForm(true);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="client-management">
      <div className="page-header">
        <h2>Client Management</h2>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h3>Client List</h3>
          <button className="add-client-btn" onClick={() => {
            if (showAddForm) {
              setEditingClient(null);
              resetForm();
            }
            setShowAddForm(!showAddForm);
          }}>
            {showAddForm ? 'Cancel' : 'Add Client'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="client-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Client Name*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description*</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="spocName">SPOC Name*</label>
                <input
                  type="text"
                  id="spocName"
                  name="spocName"
                  value={formData.spocName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="spocPno">SPOC Phone Number*</label>
                <input
                  type="tel"
                  id="spocPno"
                  name="spocPno"
                  value={formData.spocPno}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="totalHolidays">Total Holidays</label>
                <input
                  type="number"
                  id="totalHolidays"
                  name="totalHolidays"
                  value={formData.totalHolidays}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>
            <button type="submit" className="submit-btn">
              {editingClient ? 'Update Client' : 'Add Client'}
            </button>
          </form>
        )}

        <div className="clients-list">
          {clients.map(client => (
            <div key={client.clientId} className="client-card">
              <div className="client-info">
                <h3>{client.name}</h3>
                <p><strong>Description:</strong> {client.description}</p>
                <p><strong>SPOC Name:</strong> {client.spocName}</p>
                <p><strong>SPOC Phone:</strong> {client.spocPno}</p>
                <p><strong>Total Holidays:</strong> {client.totalHolidays}</p>
              </div>
              <div className="card-actions">
                <button className="edit-btn" onClick={() => handleEdit(client)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(client)}>Delete</button>
              </div>
            </div>
          ))}
          {clients.length === 0 && (
            <div className="no-clients">No clients found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientManagement;
