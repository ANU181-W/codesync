import Room from '../models/Room.js';

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private
export const createRoom = async (req, res) => {
  try {
    const { problemId, maxParticipants } = req.body;
    const room = new Room({
      problemId,
      createdBy: req.user._id,
      maxParticipants,
      participants: [{
        user: req.user._id,
        role: 'host'
      }]
    });

    const createdRoom = await room.save();
    res.status(201).json(createdRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join a room
// @route   POST /api/rooms/:id/join
// @access  Private
export const joinRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if the user is a host
    const isHost = room.createdBy.toString() === req.user._id.toString();
    if (isHost) {
      return res.status(200).json({ message: 'You are the host', room });
    }

    // Check if the user is already a participant
    const existingParticipant = room.participants.find(p => p.user.toString() === req.user._id.toString());
    if (existingParticipant) {
      return res.status(400).json({ message: 'Already in room' });
    }

    // Check if the room is full
    if (room.participants.length >= room.maxParticipants) {
      return res.status(400).json({ message: 'Room is full' });
    }

    // Add user as a participant
    room.participants.push({
      user: req.user._id,
      role: 'participant',
      joinedAt: new Date(),
    });

    const updatedRoom = await room.save();
    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// @desc    Get room by ID
// @route   GET /api/rooms/:id
// @access  Private
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('problemId')
      .populate('participants.user', 'name email');
    
    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update participant code
// @route   PUT /api/rooms/:id/code
// @access  Private
export const updateCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }

    const participant = room.participants.find(
      p => p.user.toString() === req.user._id.toString()
    );

    if (!participant) {
      res.status(400).json({ message: 'Not a participant in this room' });
      return;
    }

    participant.code = code;
    participant.language = language;

    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};