import { validationResult } from 'express-validator';
import { EventEmitter } from 'node:events';

import { MAX_RECORDS } from '../../Global/constants.js';
import { accountRepository, employeeRepository } from '../repositories/index.js';

const myEvent = new EventEmitter();
myEvent.on('event.register.account', (params) => {
	console.log(`They talked about: ${JSON.stringify(params)}`);
});

class AccountController {
	//[POST] /login
	login = async (req, res, next) => {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json({ error: error.array() });
		}
		const { username, password } = req.body;
		try {
			let existingAccount = await accountRepository.loginAccount({ username, password });
			res.status(200).json({ message: 'Login auth successfully', data: existingAccount });
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};

	//[POST] /register
	register = async (req, res, next) => {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json({ error: error.array() });
		}

		const formData = req.body;

		const account = {
			$set: {
				username: formData.username,
				password: formData.password,
				id_employee: formData.id_employee,
				account_roles: formData.account_roles,
			},
		};

		// Event Emitter
		myEvent.emit('event.register.account', formData);
		try {
			const newAccount = await accountRepository.registerAccount({ account });
			res.status(201).json({ message: 'Register auth successfully', data: newAccount });
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};

	//[PUT] /account
	update = async (req, res, next) => {
		const formData = req.body;
		const id = req.params.id;
		console.log(id);

		const account = {
			$set: {
				username: formData.username,
				password: formData.password,
				id_employee: formData.id_employee,
				account_roles: formData.account_roles,
			},
		};
		try {
			await accountRepository.updateAccount({ id, account });
			res.status(200).json({ message: 'Account updated successfully' });
		} catch (errorr) {
			res.status(500).json({ message: errorr.toString() });
			next(errorr);
		}
	};

	//[DELETE] /account
	delete = async (req, res, next) => {
		try {
			const id = req.params.id;
			await accountRepository.deleteAccount({ id });
			res.status(200).json({ message: 'Role deleted successfully' });
		} catch (errorr) {
			res.status(500).json({ message: errorr.toString() });
			next(errorr);
		}
	};

	//[POST] /create role
	create_role = async (req, res, next) => {
		try {
			const formData = req.body;
			const role = {
				$set: {
					name: formData.name,
					admin: formData.admin,
					description: formData.description,
				},
			};
			let newRole = await accountRepository.insertRole({ role });
			res.status(200).json({ message: 'Role inserted successfully', data: newRole });
		} catch (errorr) {
			res.status(500).json({ message: errorr.toString() });
			next(errorr);
		}
	};

	//[DELETE] /delete role
	delete_role = async (req, res, next) => {
		try {
			const id = req.params.id;
			await accountRepository.deleteRole({ id });
			res.status(200).json({ message: 'Role deleted successfully' });
		} catch (errorr) {
			res.status(500).json({ message: errorr.toString() });
			next(errorr);
		}
	};

	//[GET] /role
	roles = async (req, res, next) => {
		try {
			//http:localhost: 3065?page=1&size=100
			let { page = 1, size = MAX_RECORDS, searchString = '' } = req.query;
			size = size >= MAX_RECORDS ? MAX_RECORDS : size;

			let filteredRole = await accountRepository.getAllRoles({
				page,
				size,
				searchString,
			});
			res.status(200).json({
				message: 'Get all roles successfully',
				size: filteredRole.length,
				page,
				searchString,
				data: filteredRole,
			});
		} catch (errorr) {
			res.status(500).json({ message: errorr.toString() });
			next(errorr);
		}
	};

	role = async (req, res, next) => {
		try {
			const id = req.params.id;
			const role = await accountRepository.getRole({ id });
			res.status(200).json({ message: 'Get role successfully', data: role });
		} catch (errorr) {
			res.status(500).json({ message: errorr.toString() });
			next(errorr);
		}
	};

	account = async (req, res, next) => {
		try {
			const id = req.params.id;
			const auth = await accountRepository.getAccount({ id });
			res.status(200).json({ message: 'Get auth successfully', data: auth });
		} catch (errorr) {
			res.status(500).json({ message: errorr.toString() });
			next(errorr);
		}
	};

	//[GET] /index
	index = async (req, res, next) => {
		try {
			//http:localhost: 3065?page=1&size=100
			let { page = 1, size = MAX_RECORDS, searchString = '' } = req.query;
			size = size >= MAX_RECORDS ? MAX_RECORDS : size;

			let filteredAccounts = await accountRepository.getAllAccounts({
				page,
				size,
				searchString,
			});
			res.status(200).json({
				message: 'Get all account successfully',
				size: filteredAccounts.length,
				page,
				searchString,
				data: filteredAccounts,
			});
		} catch (errorr) {
			res.status(500).json({ message: errorr.toString() });
			next(errorr);
		}
	};
}

export default AccountController = new AccountController();
