const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const cors = require('cors');

const app = express();
const port = 3010;

// Configuration CORS
app.use(cors({
  origin: 'http://localhost:3000', // Autoriser les requêtes depuis ce domaine
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
  credentials: true // Autoriser les cookies et autres informations d'identification
}));

// Logger les headers de chaque requête pour vérifier CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Configuration Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Automatic API documentation'
    },
  },
  apis: ['./routes/*.js'], // Spécifiez les fichiers à scanner pour les annotations Swagger
};

const swaggerSpec = swaggerJSDoc(options);

// Utilisez swagger-ui-express pour afficher la documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Autres configurations de votre application
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/gestionnaire-file-attente', {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const authRoutes = require('./routes/auth');
const queueRoutes = require('./routes/queue');

app.use('/auth', authRoutes);
app.use('/api/queue', queueRoutes);

const httpServer = http.createServer(app);
const io = socketIo(httpServer);

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.set('io', io);

httpServer.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
});
