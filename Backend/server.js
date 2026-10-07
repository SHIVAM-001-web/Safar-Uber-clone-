const http = require('http');
const dotenv = require('dotenv');

dotenv.config();

const { initializeSocket } = require('./socket');
const ConnectDB = require('./src/db/db');
const app = require('./src/app');

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

// Socket.IO ko HTTP server ke saath attach karo
initializeSocket(server);

// MongoDB connect
ConnectDB();

// HTTP + Socket.IO server start
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});