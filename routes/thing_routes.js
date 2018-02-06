var express = require('express');
var router = express.Router();

// Require controller modules
var thing_controller = require('../controllers/things_controller');

/// THING ROUTES ///

/* GET request for list of all Thing items. */
router.get('/all', thing_controller.thing_list);

/* GET request for one Thing. */
router.get('/:id', thing_controller.thing_detail);

 /* POST request for creating Thing. */
router.post('/create', thing_controller.thing_create);

/* GET request to delete Thing. */
router.delete('/delete/:id', thing_controller.thing_delete);

/* PUT request to update Thing. */
router.put('/update/:id', thing_controller.thing_update);

// // POST request to update Thing
// router.post('/thing/:id/update', thing_controller.thing_update_post);
//


module.exports = router;
