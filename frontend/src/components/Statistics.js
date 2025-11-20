import React from 'react';
import './Statistics.css';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Statistics = ({ stats, applications }) => {
  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b'];

  const statusData = stats?.byStatus || [];
  const weeklyData = stats?.applicationsPerWeek || [];
  const topCompanies = stats?.topCompanies || [];

  // Calculate additional statistics
  const getStatusDistribution = () => {
    return statusData.map(item => ({
      name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      value: item.count
    }));
  };

  const getWeeklyChartData = () => {
    return weeklyData.map(item => ({
      week: item.week,
      applications: item.count
    })).reverse();
  };

  const getTopCompaniesData = () => {
    return topCompanies.map(item => ({
      name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
      applications: item.application_count
    }));
  };

  const getTimeToStatus = () => {
    const statusDates = {
      interview: [],
      offer: [],
      rejected: []
    };

    // This would require tracking status change dates, simplified for now
    return [];
  };

  return (
    <div className="statistics">
      <div className="stats-header">
        <h2>📊 Application Statistics</h2>
        <div className="key-metrics">
          <div className="metric-card">
            <div className="metric-label">Total Applications</div>
            <div className="metric-value">{stats?.total || 0}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Conversion Rate</div>
            <div className="metric-value">{stats?.conversionRate || 0}%</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Active Applications</div>
            <div className="metric-value">
              {applications.filter(app => 
                ['applied', 'interview'].includes(app.status)
              ).length}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Offers Received</div>
            <div className="metric-value">
              {applications.filter(app => 
                ['offer', 'accepted'].includes(app.status)
              ).length}
            </div>
          </div>
        </div>
      </div>

      <div className="charts-container">
        {statusData.length > 0 && (
          <div className="chart-card">
            <h3>Applications by Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getStatusDistribution()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getStatusDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {weeklyData.length > 0 && (
          <div className="chart-card">
            <h3>Applications Per Week (Last 12 Weeks)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getWeeklyChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#667eea"
                  strokeWidth={2}
                  name="Applications"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {topCompanies.length > 0 && (
          <div className="chart-card">
            <h3>Top Companies by Application Count</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getTopCompaniesData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#764ba2" name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {statusData.length > 0 && (
          <div className="chart-card">
            <h3>Status Distribution (Bar Chart)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getStatusDistribution()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#667eea" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {statusData.length > 0 && (
        <div className="card">
          <h3>Status Breakdown</h3>
          <div className="status-table">
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Count</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {statusData.map(item => (
                  <tr key={item.status}>
                    <td>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</td>
                    <td>{item.count}</td>
                    <td>
                      {stats?.total
                        ? ((item.count / stats.total) * 100).toFixed(1)
                        : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;

