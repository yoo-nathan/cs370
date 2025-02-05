const express = require('express');
const infoRouter = express.Router();
const infoController = require('../controllers/infoController');

//const authenticateToken = require('../authMiddleWare');
const filter = require('../filter');
const BMR = require('../BMR calculation');
const DCT = require('../dctrec');

const multer = require('multer');
const storage = multer.memoryStorage();
const path = require('node:path');
const { getPic } = require('../controllers/infoController');


infoRouter.get('/userName', infoController.getUserName);
infoRouter.get('/userEmail', infoController.getUserEmail);
infoRouter.get('/BMR', BMR.BMRcal);
infoRouter.get('/dct', DCT.getDietPlan);
infoRouter.get('/homepage', filter.filtering);
infoRouter.post('/changePic', infoController.changePic);
infoRouter.get('/getPic', infoController.getPic); 
infoRouter.post('/updateActive', infoController.updateActive);
infoRouter.get('/getActive', infoController.getActive);


module.exports = infoRouter;
