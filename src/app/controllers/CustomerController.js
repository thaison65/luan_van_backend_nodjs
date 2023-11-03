import { validationResult } from 'express-validator';
import { EventEmitter } from 'node:events';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';

import { MAX_RECORDS } from '../../Global/constants.js';
import { customerRepository } from '../repositories/index.js';

const myEvent = new EventEmitter();
myEvent.on('event.register.customer', (params) => {
	console.log(`They talked about: ${JSON.stringify(params)}`);
});

class CustomerController {
	// [POST] /customers/login
	login = async (req, res, next) => {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json({ error: error.array() });
		}
		const { phone, password } = req.body;
		try {
			let existingCustomer = await customerRepository.loginCustomer({ phone, password });
			res
				.status(200)
				.json({ message: 'Login account of customer successfully', data: existingCustomer });
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};

	//[POST] /customers/register
	register = async (req, res, next) => {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json({ error: error.array() });
		}

		const formData = req.body;
		const file = req.file;

		const customer = {
			$set: {
				first_name: formData.first_name,
				last_name: formData.last_name,
				phone: formData.phone,
				email: formData.email,
				password: formData.password,
				gender: formData.gender,
				birthday: formData.birthday,
			},
		};

		// Event Emitter
		myEvent.emit('event.register.customer', formData);

		try {
			const newcCustomer = await customerRepository.registerCustomer({ customer });
			res
				.status(201)
				.json({ message: 'Register account of customer successfully', data: newcCustomer });
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};

	update = async (req, res, next) => {
		const formData = req.body;
		const file = req.file;

		const id = req.params.id;
		try {
			const customer = {
				$set: {
					first_name: formData.first_name,
					last_name: formData.last_name,
					phone: formData.phone,
					email: formData.email,
					password: formData.password,
					gender: formData.gender,
					birthday: formData.birthday,
					img_url: file?.path,
				},
			};

			await customerRepository.updateCustomer({ id, customer });
			res.status(200).json({ message: 'Update customer successfully' });
		} catch (err) {
			if (file) {
				cloudinary.uploader.destroy(file.filename);
			}
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};

	//[GET] /:id
	customerId = async (req, res, next) => {
		try {
			const id = req.params.id;
			const customer = await customerRepository.getProfileCustomer({ id });

			//Chuyển đổi dữ liệu img_url sang dạng base64
			const base64Image = Buffer.from(customer.img_url.data, 'binary').toString()('base64');
			const imgSrc = `data:${customer.img_url.contentType};base64,${base64Image}`;
			const data = { ...customer, imgSrc };

			res.status(200).json({
				message: `Get _id: ${id} of Customer successfully`,
				data: data,
			});
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};

	//[GET] profile
	profile = async (req, res, next) => {
		const token = req.headers?.authorization?.split(' ')[1];

		try {
			const jwtObject = jwt.verify(token, process.env.JWT_SECRET);
			const id = jwtObject.data.id;
			const customer = await customerRepository.getProfileCustomer({ id });

			res.status(200).json({
				message: `Get profile of Customer successfully`,
				data: customer,
			});
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};
	// [GET] /customers
	index = async (req, res, next) => {
		try {
			//http:localhost: 3065?page=1&size=100
			let { page = 1, size = MAX_RECORDS, searchString = '' } = req.query;
			size = size >= MAX_RECORDS ? MAX_RECORDS : size;

			let filteredCustomers = await customerRepository.getAllCustomers({
				page,
				size,
				searchString,
			});
			res.status(200).json({
				message: 'Get Customers successfully',
				size: filteredCustomers.length,
				page,
				searchString,
				data: filteredCustomers,
			});
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};
}

export default CustomerController = new CustomerController();
