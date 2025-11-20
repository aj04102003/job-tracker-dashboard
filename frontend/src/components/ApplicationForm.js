import React, { useState } from 'react';
import './ApplicationForm.css';

const ApplicationForm = ({ companies, contacts, onSubmit, onAddCompany, onAddContact }) => {
  const [formData, setFormData] = useState({
    company_id: '',
    role: '',
    status: 'applied',
    applied_date: new Date().toISOString().split('T')[0],
    notes: '',
    salary_range: '',
    location: '',
    job_url: '',
    contact_ids: []
  });

  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', website: '', industry: '' });
  const [newContact, setNewContact] = useState({ company_id: '', name: '', email: '', phone: '', position: '', linkedin: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setFormData({
        company_id: '',
        role: '',
        status: 'applied',
        applied_date: new Date().toISOString().split('T')[0],
        notes: '',
        salary_range: '',
        location: '',
        job_url: '',
        contact_ids: []
      });
      alert('Application added successfully!');
    } catch (error) {
      alert('Error adding application. Please try again.');
    }
  };

  const handleAddCompanySubmit = async (e) => {
    e.preventDefault();
    try {
      await onAddCompany(newCompany);
      setNewCompany({ name: '', website: '', industry: '' });
      setShowCompanyForm(false);
      alert('Company added successfully!');
    } catch (error) {
      alert('Error adding company. Please try again.');
    }
  };

  const handleAddContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await onAddContact(newContact);
      setNewContact({ company_id: '', name: '', email: '', phone: '', position: '', linkedin: '' });
      setShowContactForm(false);
      alert('Contact added successfully!');
    } catch (error) {
      alert('Error adding contact. Please try again.');
    }
  };

  const handleContactToggle = (contactId) => {
    setFormData(prev => ({
      ...prev,
      contact_ids: prev.contact_ids.includes(contactId)
        ? prev.contact_ids.filter(id => id !== contactId)
        : [...prev.contact_ids, contactId]
    }));
  };

  const filteredContacts = formData.company_id
    ? contacts.filter(c => c.company_id === parseInt(formData.company_id))
    : contacts;

  return (
    <div className="application-form-container">
      <div className="card">
        <h2>Add New Application</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Company *</label>
              <div className="input-with-button">
                <select
                  value={formData.company_id}
                  onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                  required
                >
                  <option value="">Select a company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-secondary btn-small"
                  onClick={() => setShowCompanyForm(!showCompanyForm)}
                >
                  + New
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Role/Position *</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                placeholder="e.g., Software Engineer"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>

            <div className="form-group">
              <label>Applied Date *</label>
              <input
                type="date"
                value={formData.applied_date}
                onChange={(e) => setFormData({ ...formData, applied_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Remote, New York, NY"
              />
            </div>

            <div className="form-group">
              <label>Salary Range</label>
              <input
                type="text"
                value={formData.salary_range}
                onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                placeholder="e.g., $100k - $150k"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Job URL</label>
            <input
              type="url"
              value={formData.job_url}
              onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label>Contacts</label>
            <div className="input-with-button">
              <select
                value=""
                onChange={() => {}}
                disabled
                style={{ opacity: filteredContacts.length === 0 ? 0.5 : 1 }}
              >
                <option value="">
                  {filteredContacts.length === 0
                    ? formData.company_id
                      ? 'No contacts for this company'
                      : 'Select a company first'
                    : 'Select contacts (optional)'}
                </option>
              </select>
              <button
                type="button"
                className="btn btn-secondary btn-small"
                onClick={() => setShowContactForm(!showContactForm)}
              >
                + New
              </button>
            </div>
            {filteredContacts.length > 0 && (
              <div className="contact-checkboxes">
                {filteredContacts.map(contact => (
                  <label key={contact.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.contact_ids.includes(contact.id)}
                      onChange={() => handleContactToggle(contact.id)}
                    />
                    {contact.name} {contact.position && `- ${contact.position}`}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes about this application..."
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Add Application
          </button>
        </form>
      </div>

      {showCompanyForm && (
        <div className="card">
          <h3>Add New Company</h3>
          <form onSubmit={handleAddCompanySubmit}>
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                value={newCompany.name}
                onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input
                type="url"
                value={newCompany.website}
                onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="form-group">
              <label>Industry</label>
              <input
                type="text"
                value={newCompany.industry}
                onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                placeholder="e.g., Technology, Finance"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Add Company
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowCompanyForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showContactForm && (
        <div className="card">
          <h3>Add New Contact</h3>
          <form onSubmit={handleAddContactSubmit}>
            <div className="form-group">
              <label>Company *</label>
              <select
                value={newContact.company_id}
                onChange={(e) => setNewContact({ ...newContact, company_id: e.target.value })}
                required
              >
                <option value="">Select a company</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Position</label>
              <input
                type="text"
                value={newContact.position}
                onChange={(e) => setNewContact({ ...newContact, position: e.target.value })}
                placeholder="e.g., HR Manager, Recruiter"
              />
            </div>
            <div className="form-group">
              <label>LinkedIn</label>
              <input
                type="url"
                value={newContact.linkedin}
                onChange={(e) => setNewContact({ ...newContact, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Add Contact
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowContactForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ApplicationForm;

