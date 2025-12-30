const prisma = require("../prismaClient");


async function createPost(req, res) {
    try {
    const { title, isPublic, isPublished, content } = req.body;
    const userId = req.user?.id;

      const newPost = await prisma.post.create({
      data: {
        title: title,
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

async function editPost(req, res) {
        const postId = parseInt(req.params.id, 10);
        const userId = req.user?.id;

        if (Number.isNaN(postId)) {
            return res.status(400).send("Invalid post id");
        }
        
        try {
            //Find the specific post
            const post = await prisma.post.findUnique({
                 where: { id: postId },
            });
             //make sure post exists
            if (!post) {
                return res.status(404).send("Post not found");
            }
             // Prevent any user from editing any other user's post
            if (post.userId !== userId) {
                return res.status(403).send("Not authorized to edit this post");
            }
            //updated post
            const updates = {};
    
            if (req.body.title !==  undefined){
                   updates.title = String(req.body.title).trim();
            }
             if (req.body.content !==  undefined){
                   updates.content = String(req.body.content).trim();
            }
             if (req.body.isPublic !==  undefined){
                   updates.isPublic = req.body.isPublic; 
            }
             if (req.body.isPublished !==  undefined){
                   updates.isPublished = req.body.isPublished; 
            }
            //if no updates made do not update
            if (Object.keys(updates).length === 0) {
                return res.status(400).send("No updates entered");
            }

            //replace the specific post with the update post
            const updatedPost = await prisma.post.update({
                where: { id: postId },
                data: updates
            });
            //finally return updated post
            res.json(updatedPost)
    
        } catch (err) {
            console.log(err)
            res.status(500).send("Server error");
        }
}

module.exports = {
  createPost,
  deletePost,
  editPost
};