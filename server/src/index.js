const express = require('express')
const app = express()
const routeClient = require('./api/v1/routes/client/index')
const routeAdmin = require('./api/v1/routes/admin/index')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
//connet db
const database = require('./config/database');
database.connect();

app.use(express.json());

require('dotenv').config();
const port = process.env.PORT

app.use(cookieParser())

// Body
app.use(bodyParser.json())

// app.use(cors())

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // URL của frontend
    credentials: true // Cho phép gửi cookie
}));

routeClient(app)
routeAdmin(app)

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
