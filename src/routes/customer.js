import express from 'express';
import { body } from 'express-validator';
import { uploadCloud } from '../authentication/cloudinary.js';

const router = express.Router();

import customerController from '../app/controllers/CustomerController.js';

router.post(
	'/login',
	[
		body('phone').notEmpty(),
		body('password')
			.notEmpty()
			.isLength({ min: 8 })
			.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]+$/)
			.withMessage(
				'Mật khẩu phải có ít nhất 8 ký tự, chữ cái hoa, chữ cái thường và ký tự đặc biệt'
			),
	],
	customerController.login
);
router.post(
	'/register',
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
	uploadCloud.single('img_url'),
	customerController.register
);
router.put('/update/:id', uploadCloud.single('img_url'), customerController.update);
router.get('/profile', customerController.profile);
router.get('/:id', customerController.customerId);
router.get('/', customerController.index);

export default router;
