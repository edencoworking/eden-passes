-- Eden Coworking Passes Management Database Schema

-- Passes table
CREATE TABLE IF NOT EXISTS passes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL, -- 'day', 'week', 'month', 'annual'
    start_date TEXT NOT NULL, -- ISO date string
    end_date TEXT NOT NULL, -- ISO date string
    guest_id INTEGER,
    status TEXT DEFAULT 'active', -- 'active', 'expired', 'cancelled'
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (guest_id) REFERENCES guests (id)
);

-- Guests table
CREATE TABLE IF NOT EXISTS guests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    company TEXT,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT OR IGNORE INTO guests (id, name, email, phone, company, notes) VALUES 
(1, 'John Doe', 'john.doe@example.com', '+1234567890', 'Tech Corp', 'Regular visitor'),
(2, 'Jane Smith', 'jane.smith@example.com', '+1234567891', 'Design Studio', 'Prefers quiet areas'),
(3, 'Mike Johnson', 'mike.johnson@example.com', '+1234567892', 'Startup Inc', 'New member');

INSERT OR IGNORE INTO passes (id, type, start_date, end_date, guest_id, status) VALUES 
(1, 'month', '2024-01-01', '2024-01-31', 1, 'expired'),
(2, 'week', '2024-09-02', '2024-09-09', 2, 'active'),
(3, 'day', '2024-09-09', '2024-09-09', 3, 'active');