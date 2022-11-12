import express from 'express';
import process from 'node:process';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import Post from './models/Post.js';
import User from './models/User.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URI);

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

app.set('port', PORT);

// Add your middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World!',
  });
});

app.post('/users', async (req, res) => {
  // Make sure to validate the request body by adding middleware
  const { firstName, lastName, email, password } = req.body;

  //
  res.status(201).json(
    await User.create({
      firstName,
      lastName,
      email,
      password,
    })
  );
});

app.post('/posts', async (req, res) => {
  const { title, content } = req.body;
  const authorId = req.header('x-user-id');

  res.status(201).json(
    await Post.create({
      title,
      content,
      authorId: mongoose.Types.ObjectId(authorId),
    })
  );
});

app.get('/users/:userId/posts', async (req, res) => {
  console.log(req.headers);
  const { userId } = req.params;
  const { limit, offset } = req.query;

  res.status(200).json(await Post.getAllByAuthorId(userId, limit, offset));
});

app.delete('/posts/:postId', async (req, res) => {
  const { postId } = req.params;

  await Post.updateOne(
    {
      _id: postId,
    },
    {
      deletedAt: Date.now(),
    }
  );

  res.status(200).json({
    message: 'Successfully removed post',
  });
});

app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
