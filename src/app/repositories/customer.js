import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Customer from '../models/Customer.js';

const loginCustomer = async ({ phone, password }) => {
	try {
		let existingCustomer = await Customer.findOne({ phone: phone }).exec();
		if (!existingCustomer) {
			throw new Error('Wrong phone and password');
		}
		// not encrypt password
		// Mã hóa mật khẩu và so sánh
		const isMatched = await bcrypt.compare(password, existingCustomer.password);
		if (!isMatched) {
			throw new Error('Wrong phone and password');
		}
		// create JWT (JSON Web Token)
		let data = {
			$set: {
				id: existingCustomer._id,
			},
		};

		let accessToken = jwt.sign(
			{
				data: data.$set,
			},
			process.env.JWT_SECRET,
			{
				//expiresIn: '60', // 1 minute
				expiresIn: '15 days', // 10 days
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
		throw new Error('Cannot login account of customer');
	}
};

const registerCustomer = async ({ customer }) => {
	const user = customer.$set;
	let existingCustomer = await Customer.findOne({ phone: user.phone }).exec();
	if (!!existingCustomer) {
		throw new Error('Phone of customer already exists');
	}
	try {
		// Mã hóa mật khẩu
		const hashedPassword = await bcrypt.hash(user.password, parseInt(process.env.SALT_ROUNDS));

		// insert to db
		let hashdcustomer = { ...user, password: hashedPassword };
		const newCustomer = await Customer.create(hashdcustomer);
		return { ...newCustomer._doc, password: 'Not show' };
	} catch (error) {
		//check model validation here
		throw new Error('Cannot register customer');
	}
};

const getAllCustomers = async ({ page, size, searchString }) => {
	try {
		page = parseInt(page);
		size = parseInt(size);
		//searchString? id, email, phone...

		// aggregate data for all Customers
		let filteredCustomers = await Customer.aggregate([
			{
				$match: {
					$or: [
						{
							phone: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
						},
						{
							first_name: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
						},
						{
							last_name: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
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
		console.log('Get all Customers with paging');
		return filteredCustomers;
	} catch (error) {
		throw new Error('Get all Customer failed: ' + error.message);
	}
};

const getProfileCustomer = async ({ id }) => {
	try {
		const customer = await Customer.findOne({ _id: id }).lean();
		if (!customer) {
			throw new Error('Cannot find customer with id ' + id);
		}
		console.log('Get customer successfully');
		return customer;
	} catch (error) {
		throw new Error('Get ID of customer failed: ' + error.message);
	}
};

const updateCustomer = async ({ id, customer }) => {
	try {
		await Customer.findById({ _id: id });
		await Customer.updateOne({ _id: id }, customer?.$set);
		console.log('Updated customer successfully');
	} catch (error) {
		throw new Error('Updated customer failed: ' + error.message);
	}
};

export default {
	getAllCustomers,
	registerCustomer,
	loginCustomer,
	getProfileCustomer,
	updateCustomer,
};
