import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sujith:123@vote.hwuueei.mongodb.net/vote?retryWrites=true&w=majority';

console.log('MongoDB URI:', MONGODB_URI ? 'Found' : 'Not found');

app.use(cors());
app.use(bodyParser.json());

let db, usersCol, pollsCol, votesCol;

// Middleware to check database connection
const checkDbConnection = (req, res, next) => {
  if (!db || !usersCol || !pollsCol || !votesCol) {
    return res.status(500).json({ error: 'Database not connected' });
  }
  next();
};

MongoClient.connect(MONGODB_URI)
  .then(async client => {
    console.log('✅ Connected to MongoDB');
    db = client.db('vote');

    usersCol = db.collection('users');
    pollsCol = db.collection('polls');
    votesCol = db.collection('votes');

    console.log('🎯 Using database:', db.databaseName);
    console.log('🚀 Collections initialized');

    app.listen(PORT, () => {
      console.log(`🌐 Backend server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });

// Health check
app.get('/api/health', async (req, res) => {
  try {
    if (!usersCol) return res.status(500).json({ mongo: false });
    const count = await usersCol.countDocuments();
    const collections = await db.listCollections().toArray();

    res.json({ mongo: true, userCount: count, collections: collections.map(c => c.name) });
  } catch (err) {
    res.status(500).json({ mongo: false, error: err.message });
  }
});

// Dashboard summary
app.get('/api/summary', checkDbConnection, async (req, res) => {
  try {
    const totalUsers = await usersCol.countDocuments();
    const totalPolls = await pollsCol.countDocuments();
    const totalVotes = await votesCol.countDocuments();
    const publishedPolls = await pollsCol.countDocuments({ resultsPublished: true });

    res.json({ totalUsers, totalPolls, totalVotes, publishedPolls });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch summary', details: err.message });
  }
});

// Test insert user
app.post('/api/test-user', checkDbConnection, async (req, res) => {
  try {
    const testUser = {
      id: uuidv4(),
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date()
    };
    const result = await usersCol.insertOne(testUser);
    res.json({ success: true, user: testUser, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Users
app.get('/api/users', checkDbConnection, async (req, res) => {
  try {
    const users = await usersCol.find().toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users', checkDbConnection, async (req, res) => {
  try {
    console.log('POST /api/users body:', req.body);
    const user = { ...req.body, id: uuidv4(), createdAt: new Date() };
    const result = await usersCol.insertOne(user);
    console.log('Insert result:', result);
    if (result.acknowledged) res.status(201).json(user);
    else throw new Error('Insert failed');
  } catch (err) {
    console.error('Error inserting user:', err);
    res.status(500).json({ error: 'Failed to create user', details: err.message });
  }
});

// Polls
app.get('/api/polls', checkDbConnection, async (req, res) => {
  try {
    const polls = await pollsCol.find().toArray();
    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch polls' });
  }
});

app.post('/api/polls', checkDbConnection, async (req, res) => {
  try {
    console.log('POST /api/polls body:', req.body);
    // Generate a simple 6-character alphanumeric poll ID
    const simpleId = Math.random().toString(36).substr(2, 6).toUpperCase();
    const poll = {
      ...req.body,
      id: simpleId,
      createdAt: new Date(),
      isActive: true,
      resultsPublished: false,
      createdBy: req.body.userId || null,
      createdByUsername: req.body.username || null // Store creator's username
    };
    const result = await pollsCol.insertOne(poll);
    console.log('Insert result:', result);
    if (result.acknowledged) res.status(201).json(poll);
    else throw new Error('Insert failed');
  } catch (err) {
    console.error('Error inserting poll:', err);
    res.status(500).json({ error: 'Failed to create poll', details: err.message });
  }
});

app.get('/api/polls/:id', checkDbConnection, async (req, res) => {
  try {
    const poll = await pollsCol.findOne({ id: req.params.id });
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch poll' });
  }
});

app.put('/api/polls/:id', checkDbConnection, async (req, res) => {
  try {
    const result = await pollsCol.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!result.value) return res.status(404).json({ error: 'Poll not found' });
    res.json(result.value);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update poll' });
  }
});

app.delete('/api/polls/:id', checkDbConnection, async (req, res) => {
  try {
    await pollsCol.deleteOne({ id: req.params.id });
    await votesCol.deleteMany({ pollId: req.params.id });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete poll' });
  }
});

// Votes
app.get('/api/votes', checkDbConnection, async (req, res) => {
  try {
    const votes = await votesCol.find().toArray();
    res.json(votes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
});

app.post('/api/votes', checkDbConnection, async (req, res) => {
  try {
    console.log('POST /api/votes body:', req.body);
    // Prevent duplicate votes for the same poll by the same user
    const existingVote = await votesCol.findOne({ pollId: req.body.pollId, userId: req.body.userId });
    if (existingVote) {
      return res.status(400).json({ error: 'You have already voted in this poll.' });
    }
    // Find the poll and option text
    const poll = await pollsCol.findOne({ id: req.body.pollId });
    let optionText = '';
    if (poll && poll.options) {
      const opt = poll.options.find(o => o.id === req.body.optionId);
      if (opt) optionText = opt.text;
    }
    const vote = {
      ...req.body,
      id: uuidv4(),
      timestamp: new Date(),
      userId: req.body.userId || null,
      username: req.body.username || null, // Store voter's username
      optionText // Store the text of the voted option
    };
    const result = await votesCol.insertOne(vote);
    console.log('Insert result:', result);
    if (result.acknowledged) res.status(201).json(vote);
    else throw new Error('Insert failed');
  } catch (err) {
    console.error('Error inserting vote:', err);
    res.status(500).json({ error: 'Failed to create vote', details: err.message });
  }
});

app.get('/api/votes/poll/:pollId', checkDbConnection, async (req, res) => {
  try {
    const votes = await votesCol.find({ pollId: req.params.pollId }).toArray();
    res.json(votes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch poll votes' });
  }
});

app.get('/api/votes/user/:userId', checkDbConnection, async (req, res) => {
  try {
    const votes = await votesCol.find({ userId: req.params.userId }).toArray();
    res.json(votes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user votes' });
  }
});

// Get all polls a user has attended (voted in)
app.get('/api/attended-polls/:userId', checkDbConnection, async (req, res) => {
  try {
    // 1. Find all votes by this user
    const votes = await votesCol.find({ userId: req.params.userId }).toArray();
    const pollIds = Array.from(new Set(votes.map(v => v.pollId)));
    // 2. Fetch poll details for those pollIds
    const attendedPolls = await pollsCol.find({ id: { $in: pollIds } }).toArray();
    res.json(attendedPolls);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attended polls', details: err.message });
  }
});
