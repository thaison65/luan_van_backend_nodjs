import jwt from 'jsonwebtoken';

import Booking from '../models/Booking.js';
import DetailsBooking from '../models/DetailsBooking.js';
import StatusRoom from '../models/StatusRoom.js';

const insertBooking = async ({ booking }) => {
	try {
		const newBooking = await Booking.create(booking.$set);

		let data = {
			$set: {
				id: newBooking._id,
			},
		};
		let verificationToken = jwt.sign(
			{
				data: data.$set,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: '20 minute', // 1 minute
			}
		);

		const decoded = jwt.decode(verificationToken);
		const expireAt = decoded.exp;
		//clone an add more properties
		data.$set = { ...data.$set, expireAt };
		return {
			...data.$set,
			verificationToken: verificationToken,
		};
	} catch (error) {
		throw new Error(`Insert booking failed: ${error.message}`);
	}
};

const getIdBooking = async ({ id }) => {
	try {
		const newBooking = await Booking.findById({ _id: id });
		return newBooking;
	} catch (error) {
		throw new Error(`Get ID ${id} failed: ${error.message}`);
	}
};

const updateBooking = async ({ id, booking }) => {
	try {
		const newBooking = await Booking.updateOne({ _id: id }, booking);
		return newBooking;
	} catch (error) {
		throw new Error(`Update ID ${id} failed: ${booking}`);
	}
};

const deleteBooking = async ({ id }) => {
	try {
		await Booking.deleteOne({ _id: id });
	} catch (error) {
		throw new Error(`Delete ID ${id} failed: ${error.message}`);
	}
};

const insertDetailsBooking = async ({ detail }) => {
	try {
		await DetailsBooking.create(detail.$set);
	} catch (error) {
		throw new Error(`Insert Detail Booking failed: ${error.message}`);
	}
};

const deleteDetailsBooking = async ({ id_booking }) => {
	try {
		await DetailsBooking.deleteMany({ id_booking: id_booking });
	} catch (error) {
		throw new Error(`Delete many detailsBooking failed: ${error.message}`);
	}
};

const insertStatusRoom = async ({ status }) => {
	debugger;
	try {
		await StatusRoom.create(status.$set);
	} catch (error) {
		throw new Error(`Insert Status Room failed: ${error.message}`);
	}
};

export default {
	insertBooking,
	getIdBooking,
	updateBooking,
	deleteBooking,
	insertDetailsBooking,
	deleteDetailsBooking,
	insertStatusRoom,
};
