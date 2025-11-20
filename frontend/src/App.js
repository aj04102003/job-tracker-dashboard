import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import ApplicationForm from './components/ApplicationForm';
import ApplicationList from './components/ApplicationList';
import Statistics from './components/Statistics';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filters, setFilters] = useState({
    status: '',
    company_id: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appsRes, companiesRes, contactsRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE}/applications`, { params: filters }),
        axios.get(`${API_BASE}/companies`),
        axios.get(`${API_BASE}/contacts`),
        axios.get(`${API_BASE}/stats/overview`)
      ]);

      setApplications(appsRes.data);
      setCompanies(companiesRes.data);
      setContacts(contactsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddApplication = async (applicationData) => {
    try {
      await axios.post(`${API_BASE}/applications`, applicationData);
      fetchData();
    } catch (error) {
      console.error('Error adding application:', error);
      throw error;
    }
  };

  const handleUpdateApplication = async (id, applicationData) => {
    try {
      await axios.put(`${API_BASE}/applications/${id}`, applicationData);
      fetchData();
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  };

  const handleDeleteApplication = async (id) => {
    try {
      await axios.delete(`${API_BASE}/applications/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  };

  const handleAddCompany = async (companyData) => {
    try {
      await axios.post(`${API_BASE}/companies`, companyData);
      fetchData();
    } catch (error) {
      console.error('Error adding company:', error);
      throw error;
    }
  };

  const handleAddContact = async (contactData) => {
    try {
      await axios.post(`${API_BASE}/contacts`, contactData);
      fetchData();
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📊 Job Tracker Dashboard</h1>
        <nav className="nav-tabs">
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={activeTab === 'applications' ? 'active' : ''}
            onClick={() => setActiveTab('applications')}
          >
            Applications
          </button>
          <button
            className={activeTab === 'add' ? 'active' : ''}
            onClick={() => setActiveTab('add')}
          >
            Add Application
          </button>
          <button
            className={activeTab === 'stats' ? 'active' : ''}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
        </nav>
      </header>

      <main className="App-main">
        {loading && <div className="loading">Loading...</div>}
        
        {!loading && activeTab === 'dashboard' && (
          <Dashboard
            applications={applications}
            stats={stats}
            filters={filters}
            setFilters={setFilters}
            companies={companies}
          />
        )}

        {!loading && activeTab === 'applications' && (
          <ApplicationList
            applications={applications}
            companies={companies}
            onUpdate={handleUpdateApplication}
            onDelete={handleDeleteApplication}
            filters={filters}
            setFilters={setFilters}
          />
        )}

        {!loading && activeTab === 'add' && (
          <ApplicationForm
            companies={companies}
            contacts={contacts}
            onSubmit={handleAddApplication}
            onAddCompany={handleAddCompany}
            onAddContact={handleAddContact}
          />
        )}

        {!loading && activeTab === 'stats' && (
          <Statistics stats={stats} applications={applications} />
        )}
      </main>
    </div>
  );
}

export default App;

