const prisma = require("../prismaClient");



async function createPost(req, res) {
    try {
    const { title, isPublic, isPublished, content } = req.body;
    const userId = req.user?.id;

      const newPost = await prisma.post.create({
      data: {
        title: postTitle,
        content: content,
        userId,
        // only include isPublic if specified
        ...(typeof isPublic === "boolean" && { isPublic }),
        ...(typeof isPublished === "boolean" && { isPublished }),
      },
    });
     res.status(201).json({ message: "Post created", post: newPost });
        } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

async function deletePost(req, res){
   const postId = parseInt(req.params.id, 10);
   const userId = req.user.id;
    
    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { userId: true },
        });
        //cannot delete a non-existant post
        if (!post) {
          return res.status(404).json({ error: "Post not found" });
        }
        //prevent unathorized user from deleting post
        if (post.userId !== userId) {
          return res.status(403).json({ error: "Not authorized to delete this post" });
        }
        
        await prisma.comment.deleteMany({
             where: { postId },
        });

        await prisma.post.delete({
            where: { id: postId },
         });
         res.redirect("/"); 
        } catch (err) {
            console.log(err)
            res.status(500).send("Server error");
        };
}

module.exports = {
  createPost,
  deletePost
};