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
//work on this next!
async function editPost(req, res) {
        
        try {
            //updated post
            const updates = {};
    
            if (req.body.title != null){
                   updates.title = String(req.body.title).trim();
            }
             if (req.body.content != null){
                   updates.content = String(req.body.content).trim();
            }
             if (req.body.isPublic != null){
                   updates.isPublic = req.body.isPublic; 
            }
             if (req.body.isPublished != null){
                   updates.isPublished = req.body.isPublished; 
            }
            //if no updates made do not update
            if (Object.keys(updates).length === 0) {
                return res.status(400).send("No updates entered");
            }

            //replace the specific post with the update post
            const updatedPost = await prisma.post.update({
                where: { id: req.post.id},
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