import React from 'react';
import './Dashboard.css';
import { format } from 'date-fns';

const Dashboard = ({ applications, stats, filters, setFilters, companies }) => {
  const recentApplications = applications.slice(0, 5);

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
    <div className="dashboard">
      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total Applications</h3>
          <div className="value">{stats?.total || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Conversion Rate</h3>
          <div className="value">{stats?.conversionRate || 0}%</div>
        </div>
        <div className="stat-card">
          <h3>This Week</h3>
          <div className="value">
            {stats?.applicationsPerWeek?.[0]?.count || 0}
          </div>
        </div>
        <div className="stat-card">
          <h3>Active Applications</h3>
          <div className="value">
            {applications.filter(app => 
              ['applied', 'interview'].includes(app.status)
            ).length}
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Quick Filters</h2>
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
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Recent Applications</h2>
          {recentApplications.length === 0 ? (
            <p>No applications found. Add your first application to get started!</p>
          ) : (
            <div className="applications-list">
              {recentApplications.map(app => (
                <div key={app.id} className="application-card">
                  <div className="application-header">
                    <h3>{app.role}</h3>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(app.status) + '20', color: getStatusColor(app.status) }}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div className="application-details">
                    <p><strong>Company:</strong> {app.company_name}</p>
                    <p><strong>Applied:</strong> {format(new Date(app.applied_date), 'MMM dd, yyyy')}</p>
                    {app.location && <p><strong>Location:</strong> {app.location}</p>}
                    {app.notes && <p className="notes">{app.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {stats?.byStatus && stats.byStatus.length > 0 && (
          <div className="dashboard-section">
            <h2>Applications by Status</h2>
            <div className="status-breakdown">
              {stats.byStatus.map(item => (
                <div key={item.status} className="status-item">
                  <div className="status-label">{item.status}</div>
                  <div className="status-bar">
                    <div
                      className="status-fill"
                      style={{
                        width: `${(item.count / stats.total) * 100}%`,
                        backgroundColor: getStatusColor(item.status)
                      }}
                    />
                  </div>
                  <div className="status-count">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

