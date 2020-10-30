const express = require('express');
const controller = require('../controllers/position');
const router = express.Router()

router.get('/:categoryId', controller.getByCategoryId);
router.delete('/:id', controller.remove);
router.post('/', controller.create);
router.patch('/:id', controller.update);

module.exports = router