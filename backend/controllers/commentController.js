const prisma = require("../prismaClient");


async function createComment(req, res) {
    try {
    const { content } = req.body;
    const userId = req.user.id;
    const postId = parseInt(req.params.postId, 10);

      const newComment = await prisma.comment.create({
      data: {
        content,
        userId,
        postId,
      },
    });
     res.status(201).json({ message: "Comment created", comment: newComment });
        } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

///working here
async function deleteComment(req, res){
    try {

        await prisma.comment.delete({
            where: { id: req.comment.id },
         });
         res.status(200).json({ message: "Comment deleted" });
        } catch (err) {
            console.log(err)
            res.status(500).send("Server error");
        };
}


module.exports = {
  createComment,
  deleteComment,
};