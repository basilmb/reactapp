const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config({ path: "./.env" });
const port = process.env.PORT || 5000;
const db = process.env.DATABASE;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

// User Route
const userRoute = require('./routes/userRoute');
app.use('/api/user', userRoute);

// Admin Route
const adminRoute = require('./routes/adminRoute');
app.use('/api/admin', adminRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
