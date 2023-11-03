import express from 'express';
import multer from 'multer';

const router = express.Router();

import bookingController from '../app/controllers/BookingController.js';
import payLoadController from '../app/controllers/PayLoadController.js';

const upload = multer();

router.get('/search', bookingController.search);
router.get('/hotels/:id', bookingController.getHotel);

router.post('/pay/create-paypal-order', payLoadController.createOrder);
router.post('/pay/capture-paypal-order', payLoadController.capture);

router.post('/confirm', bookingController.confirm);
router.post('/', bookingController.booking);

export default router;
