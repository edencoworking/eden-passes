const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/guests - Get all guests
router.get('/', async (req, res) => {
    try {
        const guests = await db.all(`
            SELECT g.*, 
                   COUNT(p.id) as total_passes,
                   COUNT(CASE WHEN p.status = 'active' THEN 1 END) as active_passes
            FROM guests g 
            LEFT JOIN passes p ON g.id = p.guest_id 
            GROUP BY g.id 
            ORDER BY g.created_at DESC
        `);
        
        res.json(guests);
    } catch (error) {
        console.error('Error fetching guests:', error);
        res.status(500).json({ error: 'Failed to fetch guests' });
    }
});

// GET /api/guests/:id - Get single guest
router.get('/:id', async (req, res) => {
    try {
        const guest = await db.get(`
            SELECT g.*, 
                   COUNT(p.id) as total_passes,
                   COUNT(CASE WHEN p.status = 'active' THEN 1 END) as active_passes
            FROM guests g 
            LEFT JOIN passes p ON g.id = p.guest_id 
            WHERE g.id = ?
            GROUP BY g.id
        `, [req.params.id]);
        
        if (!guest) {
            return res.status(404).json({ error: 'Guest not found' });
        }
        
        // Get guest's passes
        const passes = await db.all(`
            SELECT * FROM passes 
            WHERE guest_id = ? 
            ORDER BY created_at DESC
        `, [req.params.id]);
        
        guest.passes = passes;
        res.json(guest);
    } catch (error) {
        console.error('Error fetching guest:', error);
        res.status(500).json({ error: 'Failed to fetch guest' });
    }
});

// POST /api/guests - Create new guest
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, company, notes } = req.body;
        
        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        
        // Check if email already exists
        const existingGuest = await db.get('SELECT id FROM guests WHERE email = ?', [email]);
        if (existingGuest) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        
        const result = await db.run(
            'INSERT INTO guests (name, email, phone, company, notes) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone || null, company || null, notes || null]
        );
        
        const newGuest = await db.get('SELECT * FROM guests WHERE id = ?', [result.id]);
        res.status(201).json(newGuest);
    } catch (error) {
        console.error('Error creating guest:', error);
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            res.status(409).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Failed to create guest' });
        }
    }
});

// PUT /api/guests/:id - Update guest
router.put('/:id', async (req, res) => {
    try {
        const { name, email, phone, company, notes } = req.body;
        
        // Check if guest exists
        const existingGuest = await db.get('SELECT * FROM guests WHERE id = ?', [req.params.id]);
        if (!existingGuest) {
            return res.status(404).json({ error: 'Guest not found' });
        }
        
        // Validate email format if provided
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
            
            // Check if email already exists for another guest
            const emailCheck = await db.get('SELECT id FROM guests WHERE email = ? AND id != ?', [email, req.params.id]);
            if (emailCheck) {
                return res.status(409).json({ error: 'Email already exists' });
            }
        }
        
        await db.run(
            'UPDATE guests SET name = ?, email = ?, phone = ?, company = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [
                name || existingGuest.name,
                email || existingGuest.email,
                phone !== undefined ? phone : existingGuest.phone,
                company !== undefined ? company : existingGuest.company,
                notes !== undefined ? notes : existingGuest.notes,
                req.params.id
            ]
        );
        
        const updatedGuest = await db.get('SELECT * FROM guests WHERE id = ?', [req.params.id]);
        res.json(updatedGuest);
    } catch (error) {
        console.error('Error updating guest:', error);
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            res.status(409).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Failed to update guest' });
        }
    }
});

// DELETE /api/guests/:id - Delete guest
router.delete('/:id', async (req, res) => {
    try {
        // Check if guest has any passes
        const passes = await db.get('SELECT COUNT(*) as count FROM passes WHERE guest_id = ?', [req.params.id]);
        if (passes.count > 0) {
            return res.status(409).json({ 
                error: 'Cannot delete guest with existing passes. Please remove or reassign passes first.' 
            });
        }
        
        const result = await db.run('DELETE FROM guests WHERE id = ?', [req.params.id]);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Guest not found' });
        }
        
        res.json({ message: 'Guest deleted successfully' });
    } catch (error) {
        console.error('Error deleting guest:', error);
        res.status(500).json({ error: 'Failed to delete guest' });
    }
});

// GET /api/guests/stats/overview - Get guest statistics
router.get('/stats/overview', async (req, res) => {
    try {
        const totalGuests = await db.get('SELECT COUNT(*) as count FROM guests');
        const guestsWithActivePasses = await db.get(`
            SELECT COUNT(DISTINCT guest_id) as count 
            FROM passes 
            WHERE status = 'active'
        `);
        const newGuestsThisMonth = await db.get(`
            SELECT COUNT(*) as count 
            FROM guests 
            WHERE date(created_at) >= date('now', 'start of month')
        `);
        
        res.json({
            total: totalGuests.count,
            withActivePasses: guestsWithActivePasses.count,
            newThisMonth: newGuestsThisMonth.count
        });
    } catch (error) {
        console.error('Error fetching guest stats:', error);
        res.status(500).json({ error: 'Failed to fetch guest statistics' });
    }
});

module.exports = router;