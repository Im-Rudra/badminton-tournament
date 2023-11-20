const app = require('./app');
const connectDB = require('./config/database');
require('dotenv').config();
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`server running at PORT:${PORT}`);
  await connectDB();
});
