import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Account from '../models/Account.js';
import Role from '../models/Role.js';

const loginAccount = async ({ username, password }) => {
	try {
		let existingAccount = await Account.findOne({ username: username }).exec();
		if (!existingAccount) {
			throw new Error('Wrong username and password');
		}
		// not encrypt password
		// Mã hóa mật khẩu và so sánh
		const isMatched = await bcrypt.compare(password, existingAccount.password);
		if (!isMatched) {
			throw new Error('Wrong username and password');
		}
		// create JWT (JSON Web Token)
		let data = {
			$set: {
				id: existingAccount._id,
				role: existingAccount.account_roles,
			},
		};

		let accessToken = jwt.sign(
			{
				data: data.$set,
			},
			process.env.JWT_SECRET,
			{
				//expiresIn: '60', // 1 minute
				expiresIn: '5 days', // 10 days
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
		throw new Error('Cannot login account');
	}
};

const registerAccount = async ({ account }) => {
	const user = account.$set;
	let existingAccount = await Account.findOne({ username: user.username }).exec();
	if (!!existingAccount) {
		throw new Error('User already exists');
	}
	try {
		// Mã hóa mật khẩu
		const hashedPassword = await bcrypt.hash(user.password, parseInt(process.env.SALT_ROUNDS));

		// insert to db
		let hashdAccount = { ...user, password: hashedPassword };
		const newAccount = await Account.create(hashdAccount);
		return { ...newAccount._doc, password: 'Not show' };
	} catch (error) {
		if (error.code === 11000) {
			throw new Error('Employee ID already exists');
		}
		//check model validation here
		throw new Error('Cannot register account');

	}
};

const updateAccount = async ({ id, account }) => {
	try {
		await Account.updateOne({ _id: id }, account?.$set);
		console.log('Updated account successfully');
	} catch (error) {
		throw new Error('Updated account failed: ' + error.message);
	}
};

const deleteAccount = async ({ id }) => {
	try {
		await Account.deleteOne({ _id: id });
		console.log('Deleted account successfully');
	} catch (error) {
		throw new Error('Deleted account failed: ' + error.message);
	}
};

const insertRole = async ({ role }) => {
	try {
		const newRole = await Role.create(role.$set);
		console.log('Inserting role successfully');
		return newRole._doc;
	} catch (error) {
		throw new Error('Inserted role failed: ' + error.message);
	}
};

const deleteRole = async ({ id }) => {
	try {
		await Role.deleteOne({ _id: id });
		console.log('Deleted role successfully');
	} catch (error) {
		throw new Error('Deleted role failed: ' + error.message);
	}
};

const getAllRoles = async ({ page, size, searchString }) => {
	try {
		page = parseInt(page);
		size = parseInt(size);
		// aggregate data for all roles
		let filteredRoles = await Role.aggregate([
			{
				$match: {}, // rỗng lấy hết
			},
			{
				$skip: (page - 1) * size, // số phần tử bỏ qua
			},
			{
				$limit: size, //Giới hạn bao nhiêu
			},
		]);
		console.log('Get all roles with paging');
		return filteredRoles;
	} catch (error) {
		throw new Error('Get all roles failed: ' + error.message);
	}
};

const getRole = async ({ id }) => {
	try {
		const role = await Role.findOne({ _id: id }).lean();
		console.log(role);
		return role;
	} catch (error) {
		throw new Error('Get ID of role failed: ' + error.message);
	}
};

const getAccount = async ({ id }) => {
	try {
		const auth = await Account.findOne({ _id: id }).lean();
		console.log(auth);
		return auth;
	} catch (error) {
		throw new Error('Get ID of account failed: ' + error.message);
	}
};

const getAllAccounts = async ({ page, size, searchString }) => {
	try {
		page = parseInt(page);
		size = parseInt(size);
		// aggregate data for all accounts
		let filteredAccounts = await Account.aggregate([
			{
				$match: {}, // rỗng lấy hết
			},
			{
				$skip: (page - 1) * size, // số phần tử bỏ qua
			},
			{
				$limit: size, //Giới hạn bao nhiêu
			},
		]);
		console.log('Get all accounts with paging');
		return filteredAccounts;
	} catch (error) {
		throw new Error('Get all account failed: ' + error.message);
	}
};

export default {
	loginAccount,
	registerAccount,
	insertRole,
	deleteRole,
	getRole,
	getAllRoles,
	getAccount,
	getAllAccounts,
	updateAccount,
	deleteAccount,
};
