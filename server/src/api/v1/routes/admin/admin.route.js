const express = require('express');
const router = express.Router();

const controller = require('../../controllers/admin/admin.controller');
const updAcc = require('../../controllers/admin/account.controller');

router.get('/getUsers', controller.getUsers);
router.put('/updateUser/:id', controller.updateUser); 
router.delete('/deleteUser/:id', controller.deleteUser);


router.patch('/updateStatus', updAcc.updateStatus);

module.exports = router;
