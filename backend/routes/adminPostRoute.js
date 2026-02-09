const express = require("express");
const prisma = require("../prisma/client");

const adminPostRoute = express.Router();

/**
 * Admin only access - all posts
 */
adminPostRoute.get('/admin/posts', async (req, res) => {
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

module.exports = adminPostRoute;