const express = require('express');
const path = require('path');
const mongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const eventRoutes = require('./routes/Routes');
const userApp = require('./routes/User-api');
const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the frontend/build directory
const staticFilesPath = path.join(__dirname, '../frontend/build');
app.use(express.static(staticFilesPath));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const dbUrl = 'mongodb+srv://nandini:nandini@cluster0.dlcj0y5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoClient.connect(dbUrl)
  .then(client => {
    const dbObj = client.db('eventManagement');
    const usersCollection = dbObj.collection('Users');
    const eventsCollection = dbObj.collection('events');
    app.set('usersCollection', usersCollection);
    app.set('eventsCollection', eventsCollection);
    console.log("DB connection success");
  })
  .catch(err => console.log("Error in DB connection: ", err));

// Routes
app.use('/api/events', eventRoutes);
app.use('/user-api', userApp);

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(staticFilesPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
