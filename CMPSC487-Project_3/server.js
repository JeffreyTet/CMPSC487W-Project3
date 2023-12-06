const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());



const users = [
    { username: 'maintenance', password: '12345', role: 'maintenance' },
    { username: 'tenant', password: '2468', role: 'tenant' },
    { username: 'manager', password: '13579', role: 'manager' },
];

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

   
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.status(200).json({ role: user.role });
    } else {
        res.status(401).json({ message: 'Login failed' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
