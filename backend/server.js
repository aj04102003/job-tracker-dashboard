const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbPath = path.join(__dirname, 'job_tracker.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database tables
const initDatabase = () => {
  db.serialize(() => {
    // Companies table
    db.run(`CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      website TEXT,
      industry TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Contacts table
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      position TEXT,
      linkedin TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
    )`);

    // Applications table
    db.run(`CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'applied',
      applied_date DATE NOT NULL,
      notes TEXT,
      salary_range TEXT,
      location TEXT,
      job_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
    )`);

    // Application contacts junction table (many-to-many)
    db.run(`CREATE TABLE IF NOT EXISTS application_contacts (
      application_id INTEGER,
      contact_id INTEGER,
      PRIMARY KEY (application_id, contact_id),
      FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
      FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
    )`);

    console.log('Database tables initialized');
  });
};

initDatabase();

// ========== COMPANIES ROUTES ==========
app.get('/api/companies', (req, res) => {
  db.all('SELECT * FROM companies ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/companies', (req, res) => {
  const { name, website, industry } = req.body;
  db.run(
    'INSERT INTO companies (name, website, industry) VALUES (?, ?, ?)',
    [name, website, industry],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, name, website, industry });
    }
  );
});

// ========== CONTACTS ROUTES ==========
app.get('/api/contacts', (req, res) => {
  const companyId = req.query.company_id;
  let query = 'SELECT c.*, co.name as company_name FROM contacts c LEFT JOIN companies co ON c.company_id = co.id';
  const params = [];

  if (companyId) {
    query += ' WHERE c.company_id = ?';
    params.push(companyId);
  }
  query += ' ORDER BY c.name';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/contacts', (req, res) => {
  const { company_id, name, email, phone, position, linkedin } = req.body;
  db.run(
    'INSERT INTO contacts (company_id, name, email, phone, position, linkedin) VALUES (?, ?, ?, ?, ?, ?)',
    [company_id, name, email, phone, position, linkedin],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, company_id, name, email, phone, position, linkedin });
    }
  );
});

// ========== APPLICATIONS ROUTES ==========
app.get('/api/applications', (req, res) => {
  const { status, company_id, start_date, end_date } = req.query;
  let query = `
    SELECT 
      a.*,
      c.name as company_name,
      c.website as company_website,
      c.industry as company_industry,
      GROUP_CONCAT(ct.name) as contact_names
    FROM applications a
    JOIN companies c ON a.company_id = c.id
    LEFT JOIN application_contacts ac ON a.id = ac.application_id
    LEFT JOIN contacts ct ON ac.contact_id = ct.id
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    query += ' AND a.status = ?';
    params.push(status);
  }
  if (company_id) {
    query += ' AND a.company_id = ?';
    params.push(company_id);
  }
  if (start_date) {
    query += ' AND a.applied_date >= ?';
    params.push(start_date);
  }
  if (end_date) {
    query += ' AND a.applied_date <= ?';
    params.push(end_date);
  }

  query += ' GROUP BY a.id ORDER BY a.applied_date DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/applications', (req, res) => {
  const { company_id, role, status, applied_date, notes, salary_range, location, job_url, contact_ids } = req.body;
  
  db.run(
    'INSERT INTO applications (company_id, role, status, applied_date, notes, salary_range, location, job_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [company_id, role, status, applied_date, notes, salary_range, location, job_url],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      const applicationId = this.lastID;
      
      // Link contacts if provided
      if (contact_ids && contact_ids.length > 0) {
        const stmt = db.prepare('INSERT INTO application_contacts (application_id, contact_id) VALUES (?, ?)');
        contact_ids.forEach(contactId => {
          stmt.run([applicationId, contactId]);
        });
        stmt.finalize();
      }
      
      res.json({ id: applicationId, company_id, role, status, applied_date, notes });
    }
  );
});

app.put('/api/applications/:id', (req, res) => {
  const { id } = req.params;
  const { company_id, role, status, applied_date, notes, salary_range, location, job_url, contact_ids } = req.body;
  
  db.run(
    'UPDATE applications SET company_id = ?, role = ?, status = ?, applied_date = ?, notes = ?, salary_range = ?, location = ?, job_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [company_id, role, status, applied_date, notes, salary_range, location, job_url, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Update contacts
      db.run('DELETE FROM application_contacts WHERE application_id = ?', [id], () => {
        if (contact_ids && contact_ids.length > 0) {
          const stmt = db.prepare('INSERT INTO application_contacts (application_id, contact_id) VALUES (?, ?)');
          contact_ids.forEach(contactId => {
            stmt.run([id, contactId]);
          });
          stmt.finalize();
        }
      });
      
      res.json({ id, company_id, role, status, applied_date, notes });
    }
  );
});

app.delete('/api/applications/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM applications WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Application deleted', id });
  });
});

// ========== STATISTICS ROUTES ==========
app.get('/api/stats/overview', (req, res) => {
  const queries = {
    total: 'SELECT COUNT(*) as count FROM applications',
    byStatus: `
      SELECT status, COUNT(*) as count 
      FROM applications 
      GROUP BY status
    `,
    conversionRate: `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status IN ('interview', 'offer', 'accepted') THEN 1 ELSE 0 END) as converted,
        ROUND(CAST(SUM(CASE WHEN status IN ('interview', 'offer', 'accepted') THEN 1 ELSE 0 END) AS FLOAT) / COUNT(*) * 100, 2) as rate
      FROM applications
    `,
    applicationsPerWeek: `
      SELECT 
        strftime('%Y-W%W', applied_date) as week,
        COUNT(*) as count
      FROM applications
      GROUP BY week
      ORDER BY week DESC
      LIMIT 12
    `,
    topCompanies: `
      SELECT 
        c.name,
        COUNT(a.id) as application_count
      FROM companies c
      JOIN applications a ON c.id = a.company_id
      GROUP BY c.id, c.name
      ORDER BY application_count DESC
      LIMIT 10
    `
  };

  Promise.all([
    new Promise((resolve, reject) => {
      db.get(queries.total, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    }),
    new Promise((resolve, reject) => {
      db.all(queries.byStatus, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),
    new Promise((resolve, reject) => {
      db.get(queries.conversionRate, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    }),
    new Promise((resolve, reject) => {
      db.all(queries.applicationsPerWeek, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),
    new Promise((resolve, reject) => {
      db.all(queries.topCompanies, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    })
  ])
  .then(([total, byStatus, conversionRate, applicationsPerWeek, topCompanies]) => {
    res.json({
      total: total.count,
      byStatus,
      conversionRate: conversionRate.rate || 0,
      applicationsPerWeek,
      topCompanies
    });
  })
  .catch(err => {
    res.status(500).json({ error: err.message });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Job Tracker API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});

