const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb+srv://dogsan:123@cluster0.uftlzs1.mongodb.net/mydatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Create a schema and model for the data
const dataSchema = new mongoose.Schema({
  data: String
});

const Data = mongoose.model('Data', dataSchema);

// Create an express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Socket.io event handler
io.on('connection', (socket) => {
  console.log('A client connected');

  // Handle data received from the consumer
  socket.on('data', (data) => {
    console.log('Received data:', data);

    // Save the data to MongoDB
    const newData = new Data({ data });
    newData.save()
      .then(() => {
        console.log('Data saved to MongoDB');
      })
      .catch((error) => {
        console.error('Error saving data to MongoDB:', error);
      });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});