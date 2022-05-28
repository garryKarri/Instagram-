const { Post } = require('../db/models');

const router = require('express').Router();

router.route('/')
  .get(async (req, res) => {
    const postsOrigin = await Post.findAll({ order: [['createdAt', 'DESC']], raw: true });
    const posts = postsOrigin.map((el) => ({ ...el, owner: el.userId === req.session.user?.id }));
    // console.log(postsOrigin);
    res.render('index', { posts });
  });

module.exports = router;
