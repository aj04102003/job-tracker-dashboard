import React, { useState } from 'react';
import './ApplicationList.css';
import { format } from 'date-fns';

const ApplicationList = ({ applications, companies, onUpdate, onDelete, filters, setFilters }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (app) => {
    setEditingId(app.id);
    setEditForm({
      company_id: app.company_id,
      role: app.role,
      status: app.status,
      applied_date: app.applied_date,
      notes: app.notes || '',
      salary_range: app.salary_range || '',
      location: app.location || '',
      job_url: app.job_url || '',
      contact_ids: []
    });
  };

  const handleSave = async (id) => {
    try {
      await onUpdate(id, editForm);
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      alert('Error updating application');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: '#1976d2',
      interview: '#f57c00',
      offer: '#388e3c',
      rejected: '#d32f2f',
      accepted: '#2e7d32',
      withdrawn: '#7b1fa2'
    };
    return colors[status] || '#666';
  };

  return (
    <div className="application-list">
      <div className="card">
        <h2>All Applications</h2>
        
        <div className="filters">
          <div className="form-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
              <option value="accepted">Accepted</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
          <div className="form-group">
            <label>Company</label>
            <select
              value={filters.company_id}
              onChange={(e) => setFilters({ ...filters, company_id: e.target.value })}
            >
              <option value="">All Companies</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
            />
          </div>
          <div className="form-group">
            <button
              className="btn btn-secondary"
              onClick={() => setFilters({ status: '', company_id: '', start_date: '', end_date: '' })}
            >
              Clear
            </button>
          </div>
        </div>

        {applications.length === 0 ? (
          <p className="no-results">No applications found matching your filters.</p>
        ) : (
          <div className="applications-table">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Applied Date</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    {editingId === app.id ? (
                      <>
                        <td>
                          <select
                            value={editForm.company_id}
                            onChange={(e) => setEditForm({ ...editForm, company_id: e.target.value })}
                            className="edit-input"
                          >
                            {companies.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editForm.role}
                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                            className="edit-input"
                          />
                        </td>
                        <td>
                          <select
                            value={editForm.status}
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                            className="edit-input"
                          >
                            <option value="applied">Applied</option>
                            <option value="interview">Interview</option>
                            <option value="offer">Offer</option>
                            <option value="rejected">Rejected</option>
                            <option value="accepted">Accepted</option>
                            <option value="withdrawn">Withdrawn</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="date"
                            value={editForm.applied_date}
                            onChange={(e) => setEditForm({ ...editForm, applied_date: e.target.value })}
                            className="edit-input"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editForm.location}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            className="edit-input"
                          />
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-primary btn-small"
                              onClick={() => handleSave(app.id)}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-secondary btn-small"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{app.company_name}</td>
                        <td>
                          <strong>{app.role}</strong>
                          {app.job_url && (
                            <a href={app.job_url} target="_blank" rel="noopener noreferrer" className="job-link">
                              🔗
                            </a>
                          )}
                        </td>
                        <td>
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: getStatusColor(app.status) + '20',
                              color: getStatusColor(app.status)
                            }}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td>{format(new Date(app.applied_date), 'MMM dd, yyyy')}</td>
                        <td>{app.location || '-'}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-secondary btn-small"
                              onClick={() => handleEdit(app)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-small"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this application?')) {
                                  onDelete(app.id);
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationList;

