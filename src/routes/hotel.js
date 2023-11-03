import express from 'express';
import { body } from 'express-validator';

import { uploadCloud } from '../authentication/cloudinary.js';

import userHotelController from '../app/controllers/UserHotelController.js';
import hotelController from '../app/controllers/HotelController.js';

const router = express.Router();

router.post(
	'/users/login',
	[
		body('email')
			.notEmpty()
			.isLength({ min: 5 })
			.isEmail()
			.withMessage('Phải đúng định dạng email và ít nhất 5 ký tự'),
		body('password')
			.notEmpty()
			.isLength({ min: 8 })
			.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]+$/)
			.withMessage(
				'Mật khẩu phải có ít nhất 8 ký tự, chữ cái hoa, chữ cái thường và ký tự đặc biệt'
			),
	],
	userHotelController.login
);
router.post(
	'/users/register',
	[
		body('phone').notEmpty(),
		body('password')
			.notEmpty()
			.isLength({ min: 8 })
			.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]+$/)
			.withMessage(
				'Mật khẩu phải có ít nhất 8 ký tự, chữ cái hoa, chữ cái thường và ký tự đặc biệt'
			),
		body('email')
			.notEmpty()
			.isLength({ min: 5 })
			.isEmail()
			.withMessage('Phải đúng định dạng email và ít nhất 5 ký tự'),
	],
	userHotelController.register
);
router.put('/users/update/:id', userHotelController.update);
router.get('/users/profile', userHotelController.profile);
router.get('/users/:id', userHotelController.userHotelId);
router.get('/users', userHotelController.userHotels);

// hoteltypes
router.post('/types/insert', hotelController.insertHotelType);
router.delete('/types/delete/:id', hotelController.deleteHotelType);
router.get('/types', hotelController.hoteltypes);

// hotel and Image
router.post('/insert', uploadCloud.array('img_url', 5), hotelController.insertHotet);
router.get('/images/:id', hotelController.getAllImgofHotel);

router.get('/managers/:id', hotelController.getAllHotels);
router.get('/:id', hotelController.getHotel);
router.get('/', hotelController.index);

export default router;
