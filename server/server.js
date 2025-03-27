const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 數據庫連接
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 蘑菇模型
const MushroomSchema = new mongoose.Schema({
  posterName: String,
  timeSlot: String,
  mushroomType: String,
  maxRegistrants: Number,
  registrants: [String],
  createdAt: { type: Date, default: Date.now }
});

const Mushroom = mongoose.model('Mushroom', MushroomSchema);

// 中間件
app.use(cors());
app.use(express.json());

// 託管靜態文件
app.use(express.static(path.join(__dirname, '../client')));

// 主頁路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Socket.IO 連接處理
io.on('connection', (socket) => {
  console.log('New client connected');

  // 發布蘑菇
  socket.on('createMushroom', async (mushroomData) => {
    try {
      const newMushroom = new Mushroom(mushroomData);
      await newMushroom.save();
      io.emit('mushroomCreated', newMushroom);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  // 更新蘑菇
  socket.on('updateMushroom', async (mushroomData) => {
    try {
      const updatedMushroom = await Mushroom.findByIdAndUpdate(
        mushroomData._id, 
        mushroomData, 
        { new: true }
      );
      io.emit('mushroomUpdated', updatedMushroom);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  // 報名蘑菇
  socket.on('registerForMushroom', async (data) => {
    try {
      const { mushroomId, registrantName } = data;
      const mushroom = await Mushroom.findById(mushroomId);

      if (mushroom.registrants.length < mushroom.maxRegistrants) {
        mushroom.registrants.push(registrantName);
        await mushroom.save();
        io.emit('mushroomRegistered', mushroom);
      } else {
        socket.emit('registrationError', '蘑菇已額滿');
      }
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  // 刪除蘑菇
  socket.on('deleteMushroom', async (mushroomId) => {
    try {
      await Mushroom.findByIdAndDelete(mushroomId);
      io.emit('mushroomDeleted', mushroomId);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// API 路由
app.get('/mushrooms', async (req, res) => {
  try {
    const mushrooms = await Mushroom.find();
    res.json(mushrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
