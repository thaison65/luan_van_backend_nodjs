import express from 'express';

const router = express.Router();

import promotionController from '../app/controllers/PromotionController.js';

router.post('/insertOfHotel', promotionController.insertOfHotel);
router.get('/getDiscountOfHotel', promotionController.getDiscountOfHotel);

export default router;
