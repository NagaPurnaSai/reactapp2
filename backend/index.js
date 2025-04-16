const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

console.log(supabase);

// ✅ Customer login
app.post('/login', async (req, res) => {
    const { name, phone } = req.body;

    try {
        // Check if user already exists
        let { data: existingUser, error: fetchError } = await supabase
            .from('customers')
            .select('*')
            .eq('phone', phone)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            return res.status(400).json(fetchError);
        }

        if (existingUser) {
            return res.json({ message: 'User already exists', user: existingUser });
        }

        // Insert new user if not exists
        const { data, error } = await supabase
            .from('customers')
            .insert([{ name, phone }])
            .select();

        if (error) return res.status(400).json(error);
        res.json({ message: 'Login successful', user: data });

    } catch (err) {
        console.error("Error in login:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Fetch juices
app.get('/juices', async (req, res) => {
    const { data, error } = await supabase.from('juices').select('*');
    if (error) return res.status(400).json(error);
    res.json(data);
});

// ✅ Place order
app.post('/order', async (req, res) => {
    const { name, phone, items } = req.body;
    const { data, error } = await supabase.from('orders').insert([{ name, phone, items }]);

    if (error) return res.status(400).json(error);
    res.json({ message: 'Order placed successfully', order: data });
});

// ✅ Admin - View orders
app.get('/orders', async (req, res) => {
    const { data, error } = await supabase.from('orders').select('*');
    if (error) return res.status(400).json(error);
    res.json(data);
});
// ✅ Add a new juice
app.post('/juices', async (req, res) => {
    const { name, price } = req.body;

    const { data, error } = await supabase.from('juices').insert([{ name, price }]);

    if (error) return res.status(400).json(error);
    res.json({ message: 'Juice added successfully', juice: data });
});

// ✅ Delete a juice
app.delete('/juices/:id', async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase.from('juices').delete().eq('id', id);

    if (error) return res.status(400).json(error);
    res.json({ message: 'Juice deleted successfully' });
});

// ✅ Delete an order when completed
app.delete('/orders/:id', async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase.from('orders').delete().eq('id', id);

    if (error) return res.status(400).json(error);
    res.json({ message: 'Order marked as completed and deleted' });
});

// ✅ Start server
app.listen(5000, () => console.log('Server running on port 5000'));

