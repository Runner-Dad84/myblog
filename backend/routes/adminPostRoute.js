import express from 'express';
import prisma from '../prisma/client.js';

const router = express.Router();

/**
 * Admin only access - all posts
 */
router.get('/public', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
            select: {
        id: true,
        username: true
      },
    },
},
      orderBy: {
        generatedAt: 'desc'
      }
    });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch public posts' });
  }
});