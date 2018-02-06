var express = require('express');
var router = express.Router();

var opc_nodes = require('../connection/opcua/nodes_monitoring');

router.get('/opcua/on', opc_nodes.monitoring);

module.exports = router;
