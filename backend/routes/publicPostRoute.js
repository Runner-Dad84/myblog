const express = require("express");
const prisma = require("../prisma/client");

const publicPostRoute = express.Router();

/**
 * PUBLIC POSTS
 * Anyone can access
 */
publicPostRoute.get('/public', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        isPublic: true,
        isPublished: true
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
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

module.exports = publicPostRoute;