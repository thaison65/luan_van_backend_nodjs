import { validationResult } from 'express-validator';
import { EventEmitter } from 'node:events';
import jwt from 'jsonwebtoken';

import fs from 'fs';

import { MAX_RECORDS } from '../../Global/constants.js';
import { userHotelRepository } from '../repositories/index.js';

const myEvent = new EventEmitter();
myEvent.on('event.register.userHotel', (params) => {
	console.log(`They talked about: ${JSON.stringify(params)}`);
});

class UserHotelController {
	// [POST] /userHotels/login

	login = async (req, res, next) => {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json({ error: error.array() });
		}

		const { email, password } = req.body;
		try {
			let existinguserHotel = await userHotelRepository.loginUserHotel({ email, password });
			res
				.status(200)
				.json({ message: 'Login account of userHotel successfully', data: existinguserHotel });
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};

	//[POST] /userHotels/register
	register = async (req, res, next) => {
		debugger;
		const error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json({ error: error.array() });
		}

		const formData = req.body;

		const userHotel = {
			$set: {
				first_name: formData.first_name,
				last_name: formData.last_name,
				card_id: formData.card_id,
				phone: formData.phone,
				email: formData.email,
				password: formData.password,
				address: formData.address,
				gender: formData.gender,
				birthday: formData.birthday,
			},
		};

		// Event Emitter
		myEvent.emit('event.register.userHotel', formData);

		try {
			await userHotelRepository.registerUserHotel({ userHotel });
			res.status(201).json({ message: 'Register account of userHotel successfully' });
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};

	//[PUT] /update/:id
	update = async (req, res, next) => {
		try {
			const formData = req.body;
			const id = req.params.id;
			const userHotel = {
				$set: {
					first_name: formData.first_name,
					last_name: formData.last_name,
					card_id: formData.card_id,
					phone: formData.phone,
					email: formData.email,
					password: formData.password,
					address: formData.address,
					gender: formData.gender,
					birthday: formData.birthday,
				},
			};
			await userHotelRepository.updateuserHotel({ id, userHotel });
			res.status(200).json({ message: 'Update userHotel successfully' });
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};

	//[GET] /:id
	userHotelId = async (req, res, next) => {
		try {
			const id = req.params.id;
			const userHotel = await userHotelRepository.getProfileUserHotel({ id });
			// Chuyển đổi dữ liệu img_url sang dạng base64
			// const base64Image = Buffer.from(userHotel.img_url.data, 'binary').toString()('base64');
			// const imgSrc = `data:${userHotel.img_url.contentType};base64,${base64Image}`;
			// const data = { ...userHotel, imgSrc };
			res.status(200).json({
				message: `Get _id: ${id} of userHotel successfully`,
				data: userHotel,
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
			const userHotel = await userHotelRepository.getProfileUserHotel({ id });
			// Chuyển đổi dữ liệu img_url sang dạng base64
			// const base64Image = Buffer.from(userHotel.img_url.data, 'binary').toString()('base64');
			// const imgSrc = `data:${userHotel.img_url.contentType};base64,${base64Image}`;
			// const data = { ...userHotel, imgSrc };
			res.status(200).json({
				message: `Get profile of userHotel successfully`,
				data: userHotel,
			});
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};
	// [GET] /userHotels
	userHotels = async (req, res, next) => {
		try {
			//http:localhost: 3065?page=1&size=100
			let { page = 1, size = MAX_RECORDS, searchString = '' } = req.query;
			size = size >= MAX_RECORDS ? MAX_RECORDS : size;

			let filteredUserHotels = await userHotelRepository.getAllUserHotel({
				page,
				size,
				searchString,
			});
			res.status(200).json({
				message: 'Get userHotels successfully',
				size: filteredUserHotels.length,
				page,
				searchString,
				data: filteredUserHotels,
			});
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};
}

export default UserHotelController = new UserHotelController();
