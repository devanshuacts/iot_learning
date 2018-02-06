var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/users_controller');

/* GET users listing. */
router.get('/', user_controller.index)

router.get('/all', user_controller.user_list)

router.get('/:id', user_controller.get_user)

router.post('/create', user_controller.create_user)

router.put('/update/:id', user_controller.update_user)

router.delete('/delete/:id', user_controller.delete_user)

module.exports = router;
