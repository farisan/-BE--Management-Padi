const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

// Setup Swagger UI
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customCssUrl: CSS_URL }));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./src/routes/authRoutes');
const penanamanRoutes = require('./src/routes/penanamanRoutes');
const userRoutes = require('./src/routes/userRoutes');
const panenRoutes = require('./src/routes/panenRoutes');
const pengajuanRoutes = require('./src/routes/pengajuanRoutes');
const transaksiRoutes = require('./src/routes/transaksiRoutes');

// Basic route
app.get('/', (req, res) => {
  res.json({ message: `Welcome to Management Padi API ${process.env.DATABASE_URL} ${process.env.DIRECT_URL}` });
});

app.use('/api/auth', authRoutes);
app.use('/api/penanaman', penanamanRoutes);
app.use('/api/users', userRoutes);
app.use('/api/panen', panenRoutes);
app.use('/api/pengajuan', pengajuanRoutes);
app.use('/api/transaksi', transaksiRoutes);

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
