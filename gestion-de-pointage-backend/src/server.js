const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./utils/errorHandler');
const sessionRoutes=require('./routes/sessionRoutes');
const rattrapageRoutes=require('./routes/rattrapagesRoutes');
const absenceRoutes=require('./routes/absenceRoutes');
const penaliteRoutes=require('./routes/penaliteRoutes');
const parametresRoutes = require('./routes/parametresTravailRoutes');

dotenv.config();

const app = express();

// Update the CORS configuration
app.use(cors({
    origin: '*', // This allows all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    // credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
  }));

app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/rattrapages', rattrapageRoutes);
app.use('/api/absence', absenceRoutes);
app.use('/api/penalites', penaliteRoutes);
app.use('/api/parametres', parametresRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});