import express from 'express';
import multer from 'multer';
const router = express.Router();

import placeNameController from '../app/controllers/PlaceController.js';

const upload = multer();

router.post('/cities/insert', placeNameController.insertCity);
router.post('/famous/insert', placeNameController.insertFamous);

router.get('/cities/search', placeNameController.search);
router.get('/cities', placeNameController.getCities);

router.post('/insert', placeNameController.insert);
router.put('/update/:id', placeNameController.update);
router.delete('/delete/:id', placeNameController.delete);
router.get('/', placeNameController.index);

export default router;
