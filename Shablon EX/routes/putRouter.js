const router = require('express').Router();
const upload = require('../middleware/uploadMiddle');
const { Post } = require('../db/models');
const { checkUser } = require('../middleware/userMiddle');

//    /put/:id
router.route('/:id')
  .put(upload.single('img'), async (req, res) => {
    console.log('--START UPD-->', req.file);
    const updatePost = await Post.update(
      { ...req.body, img: req.file?.filename, userId: req.session.user.id },

      { where: { id: Number(req.params.id) } },
    );
    const result = await Post.findOne({ where: { id: +req.params.id }, raw: true });
    res.json({ result });
  });

module.exports = router;
