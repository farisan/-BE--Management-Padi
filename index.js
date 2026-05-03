const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customCssUrl: CSS_URL }));


const { PrismaClient } = require('@prisma/client');

let prisma;

if (!global.prisma) {
  global.prisma = new PrismaClient();
}
prisma = global.prisma;

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
  res.json({
    message: "Welcome to Management Padi API"
  });
});


app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'DB CONNECTED' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB ERROR', detail: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/penanaman', penanamanRoutes);
app.use('/api/users', userRoutes);
app.use('/api/panen', panenRoutes);
app.use('/api/pengajuan', pengajuanRoutes);
app.use('/api/transaksi', transaksiRoutes);

// ❌ HAPUS app.listen
// ✅ export handler
module.exports = app;