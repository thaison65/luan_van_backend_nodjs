import express from 'express';
import { body } from 'express-validator';
const router = express.Router();

import accountController from '../app/controllers/AccountController.js';

// register account
router.post(
	'/register',
	[
		body('username')
			.notEmpty()
			.isLength({ min: 5 })
			.matches(/^[a-z\d]+$/)
			.withMessage('Username phải có ít nhất 5 ký tự'),
		body('password')
			.notEmpty()
			.isLength({ min: 8 })
			.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]+$/)
			.withMessage(
				'Mật khẩu phải có ít nhất 8 ký tự, chữ cái hoa, chữ cái thường và ký tự đặc biệt'
			),
	],
	accountController.register
);

// login account
router.post(
	'/login',
	[
		body('username')
			.notEmpty()
			.isLength({ min: 5 })
			.matches(/^[a-z\d]+$/)
			.withMessage('Username phải có ít nhất 5 ký tự'),
		body('password')
			.notEmpty()
			.isLength({ min: 8 })
			.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]+$/)
			.withMessage(
				'Mật khẩu phải có ít nhất 8 ký tự, chữ cái hoa, chữ cái thường và ký tự đặc biệt'
			),
	],
	accountController.login
);

// post role
router.post('/roles/insert', accountController.create_role);

// delete role
router.delete('/roles/delete', accountController.delete_role);

// get role
router.get('/roles/:id', accountController.role);

// get all roles
router.get('/roles', accountController.roles);

// put account
router.put('/update/:id', accountController.update);

// get account
router.get('/:id', accountController.account);

// get all accounts
router.get('/', accountController.index);

export default router;
