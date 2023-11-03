import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Hotel_Management from '../models/Hotel_Management.js';

const loginUserHotel = async ({ email, password }) => {
	try {
		let existingUserHotel = await Hotel_Management.findOne({ email: email }).exec();
		if (!existingUserHotel) {
			throw new Error('Wrong email and password');
		}
		// not encrypt password
		// Mã hóa mật khẩu và so sánh
		const isMatched = await bcrypt.compare(password, existingUserHotel.password);
		if (!isMatched) {
			throw new Error('Wrong email and password');
		}
		// create JWT (JSON Web Token)
		let data = {
			$set: {
				id: existingUserHotel._id,
			},
		};

		let accessToken = jwt.sign(
			{
				data: data.$set,
			},
			process.env.JWT_SECRET,
			{
				//expiresIn: '60', // 1 minute
				expiresIn: '10 days', // 10 days
			}
		);

		const decoded = jwt.decode(accessToken);
		const expireAt = decoded.exp;
		//clone an add more properties
		data.$set = { ...data.$set, expireAt };
		return {
			...data.$set,
			accessToken: accessToken,
		};
	} catch (error) {
		throw new Error('Cannot login account of UserHotel');
	}
};

const registerUserHotel = async ({ userHotel }) => {
	const user = userHotel.$set;
	let existingUserHotel = await Hotel_Management.findOne({ email: user.email }).exec();
	if (!!existingUserHotel) {
		throw new Error('Email of userHotel already exists');
	}
	try {
		// Mã hóa mật khẩu
		const hashedPassword = await bcrypt.hash(user.password, parseInt(process.env.SALT_ROUNDS));

		// insert to db
		let hashduser = { ...user, password: hashedPassword };
		await Hotel_Management.create(hashduser);
	} catch (error) {
		//check model validation here
		throw new Error('Cannot register userHotel');
	}
};

const getAllUserHotel = async ({ page, size, searchString }) => {
	try {
		page = parseInt(page);
		size = parseInt(size);
		//searchString? id, email, phone...

		// aggregate data for all Customers
		let filteredUserHotels = await Hotel_Management.aggregate([
			{
				$match: {
					$or: [
						{
							email: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
						},
						{
							last_name: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
						},
						{
							card_id: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
						},
						{
							phone: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
						},
					],
				}, // rỗng lấy hết
			},
			{
				$skip: (page - 1) * size, // số phần tử bỏ qua
			},
			{
				$limit: size, //Giới hạn bao nhiêu
			},
		]);
		console.log('Get all UserHotels with paging');
		return filteredUserHotels;
	} catch (error) {
		throw new Error('Get all UserHotel failed: ' + error.message);
	}
};

const getProfileUserHotel = async ({ id }) => {
	try {
		const userHotel = await Hotel_Management.findById({ _id: id }).lean();
		if (!userHotel) {
			throw new Error('Cannot find UserHotel with id ' + id);
		}
		console.log('Get UserHotel successfully');
		return userHotel;
	} catch (error) {
		throw new Error('Get ID of userHotel failed: ' + error.message);
	}
};

const updateUserHotel = async ({ id, userHotel }) => {
	try {
		await Hotel_Management.updateOne({ _id: id }, userHotel?.$set);
		console.log('Updated userHotel successfully');
	} catch (error) {
		throw new Error('Updated userHotel failed: ' + error.message);
	}
};

export default {
	loginUserHotel,
	registerUserHotel,
	getAllUserHotel,
	getProfileUserHotel,
	updateUserHotel,
};
