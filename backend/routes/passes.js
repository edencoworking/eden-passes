const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Helper function to check if pass is expired
const isPassExpired = (endDate) => {
    return new Date(endDate) < new Date();
};

// Helper function to update pass status based on expiration
const updatePassStatus = async (pass) => {
    if (pass.status === 'active' && isPassExpired(pass.end_date)) {
        await db.run(
            'UPDATE passes SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            ['expired', pass.id]
        );
        pass.status = 'expired';
    }
    return pass;
};

// GET /api/passes - Get all passes
router.get('/', async (req, res) => {
    try {
        const passes = await db.all(`
            SELECT p.*, g.name as guest_name, g.email as guest_email 
            FROM passes p 
            LEFT JOIN guests g ON p.guest_id = g.id 
            ORDER BY p.created_at DESC
        `);
        
        // Update pass statuses based on expiration
        const updatedPasses = await Promise.all(
            passes.map(pass => updatePassStatus(pass))
        );
        
        res.json(updatedPasses);
    } catch (error) {
        console.error('Error fetching passes:', error);
        res.status(500).json({ error: 'Failed to fetch passes' });
    }
});

// GET /api/passes/:id - Get single pass
router.get('/:id', async (req, res) => {
    try {
        const pass = await db.get(`
            SELECT p.*, g.name as guest_name, g.email as guest_email 
            FROM passes p 
            LEFT JOIN guests g ON p.guest_id = g.id 
            WHERE p.id = ?
        `, [req.params.id]);
        
        if (!pass) {
            return res.status(404).json({ error: 'Pass not found' });
        }
        
        const updatedPass = await updatePassStatus(pass);
        res.json(updatedPass);
    } catch (error) {
        console.error('Error fetching pass:', error);
        res.status(500).json({ error: 'Failed to fetch pass' });
    }
});

// POST /api/passes - Create new pass
router.post('/', async (req, res) => {
    try {
        const { type, start_date, end_date, guest_id } = req.body;
        
        // Validate required fields
        if (!type || !start_date || !end_date) {
            return res.status(400).json({ error: 'Type, start_date, and end_date are required' });
        }
        
        // Validate pass type
        const validTypes = ['day', 'week', 'month', 'annual'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ error: 'Invalid pass type' });
        }
        
        // Check if guest exists if guest_id provided
        if (guest_id) {
            const guest = await db.get('SELECT id FROM guests WHERE id = ?', [guest_id]);
            if (!guest) {
                return res.status(400).json({ error: 'Guest not found' });
            }
        }
        
        const result = await db.run(
            'INSERT INTO passes (type, start_date, end_date, guest_id) VALUES (?, ?, ?, ?)',
            [type, start_date, end_date, guest_id]
        );
        
        const newPass = await db.get(`
            SELECT p.*, g.name as guest_name, g.email as guest_email 
            FROM passes p 
            LEFT JOIN guests g ON p.guest_id = g.id 
            WHERE p.id = ?
        `, [result.id]);
        
        res.status(201).json(newPass);
    } catch (error) {
        console.error('Error creating pass:', error);
        res.status(500).json({ error: 'Failed to create pass' });
    }
});

// PUT /api/passes/:id - Update pass
router.put('/:id', async (req, res) => {
    try {
        const { type, start_date, end_date, guest_id, status } = req.body;
        
        // Check if pass exists
        const existingPass = await db.get('SELECT * FROM passes WHERE id = ?', [req.params.id]);
        if (!existingPass) {
            return res.status(404).json({ error: 'Pass not found' });
        }
        
        // Validate pass type if provided
        if (type) {
            const validTypes = ['day', 'week', 'month', 'annual'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({ error: 'Invalid pass type' });
            }
        }
        
        // Validate status if provided
        if (status) {
            const validStatuses = ['active', 'expired', 'cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ error: 'Invalid status' });
            }
        }
        
        // Check if guest exists if guest_id provided
        if (guest_id) {
            const guest = await db.get('SELECT id FROM guests WHERE id = ?', [guest_id]);
            if (!guest) {
                return res.status(400).json({ error: 'Guest not found' });
            }
        }
        
        await db.run(
            'UPDATE passes SET type = ?, start_date = ?, end_date = ?, guest_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [
                type || existingPass.type,
                start_date || existingPass.start_date,
                end_date || existingPass.end_date,
                guest_id !== undefined ? guest_id : existingPass.guest_id,
                status || existingPass.status,
                req.params.id
            ]
        );
        
        const updatedPass = await db.get(`
            SELECT p.*, g.name as guest_name, g.email as guest_email 
            FROM passes p 
            LEFT JOIN guests g ON p.guest_id = g.id 
            WHERE p.id = ?
        `, [req.params.id]);
        
        res.json(updatedPass);
    } catch (error) {
        console.error('Error updating pass:', error);
        res.status(500).json({ error: 'Failed to update pass' });
    }
});

// DELETE /api/passes/:id - Delete pass
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.run('DELETE FROM passes WHERE id = ?', [req.params.id]);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Pass not found' });
        }
        
        res.json({ message: 'Pass deleted successfully' });
    } catch (error) {
        console.error('Error deleting pass:', error);
        res.status(500).json({ error: 'Failed to delete pass' });
    }
});

// GET /api/passes/stats/overview - Get dashboard stats
router.get('/stats/overview', async (req, res) => {
    try {
        const totalPasses = await db.get('SELECT COUNT(*) as count FROM passes');
        const activePasses = await db.get('SELECT COUNT(*) as count FROM passes WHERE status = "active"');
        const expiredPasses = await db.get('SELECT COUNT(*) as count FROM passes WHERE status = "expired"');
        const todayPasses = await db.get(`
            SELECT COUNT(*) as count FROM passes 
            WHERE date(start_date) <= date('now') AND date(end_date) >= date('now') AND status = 'active'
        `);
        
        res.json({
            total: totalPasses.count,
            active: activePasses.count,
            expired: expiredPasses.count,
            today: todayPasses.count
        });
    } catch (error) {
        console.error('Error fetching pass stats:', error);
        res.status(500).json({ error: 'Failed to fetch pass statistics' });
    }
});

module.exports = router;