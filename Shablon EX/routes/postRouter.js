const router = require('express').Router();
const upload = require('../middleware/uploadMiddle');
const { Post } = require('../db/models');
const { checkUser } = require('../middleware/userMiddle');

router.route('/')
  .post(upload.single('img'), async (req, res) => {
    const newPost = await Post.create(
      { ...req.body, img: req.file?.filename, userId: req.session.user.id },
    );
    res.json({ newPost });
    console.log('--->', newPost);
  });

router.route('/:id')
  .delete(checkUser, async (req, res) => {
    await Post.destroy({ where: { id: req.params.id } });
    res.sendStatus('200');
  });
//    /post/:id
router.route('/:id')
  .get(checkUser, async (req, res) => {
    try {
      const result = await Post.findOne({ where: { id: req.params.id } });
      res.json(result);
    } catch (error) {
      res.sendStatus(418);
    }
  });

module.exports = router;
