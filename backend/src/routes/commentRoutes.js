const express = require('express');
const { addComment, getComments, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, addComment);
router.get('/:recipeId', getComments);
router.delete('/:id', protect, deleteComment);

module.exports = router;
