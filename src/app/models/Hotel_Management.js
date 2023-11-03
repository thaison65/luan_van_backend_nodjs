import mongoose from 'mongoose';
import beautifyUnique from 'mongoose-beautiful-unique-validation';

import pkg from 'validator';
const { isEmail } = pkg;
import slug from 'mongoose-slug-updater';

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const HotelManagementSchema = new Schema(
	// Các thuộc tính của model HotelManagement
	{
		id: { type: mongoose.Types.ObjectId },
		first_name: {
			type: String,
			required: true,
			validate: {
				validator: (value) => value.length > 0,
				message: 'Must be at least 0 characters long',
			},
		},
		last_name: {
			type: String,
			required: true,
			validate: {
				validator: (value) => value.length > 0,
				message: 'Must be at least 0 characters long',
			},
		},
		card_id: {
			type: String,
			required: true,
			unique: true,
			validate: {
				validator: (value) => value.length === 9 || value.length === 12,
				message: 'Card ID must be between 8 and 12 characters',
			},
		},
		email: {
			type: String,
			maxLength: 50,
			required: true,
			validate: {
				validator: isEmail,
				message: 'Email is inconrrect format',
			},
		},
		phone: {
			type: String,
			maxLength: 11,
			required: true,
			validate: {
				validator: (value) => isNaN && value.length === 10,
				message: 'Phone number must be 10 characters long',
			},
		},
		password: {
			type: String,
			required: true,
			validate: {
				validator: (value) => value.length > 8,
				message: 'Password must be at least 8 characters and contain only',
			},
		},
		address: { type: String },
		gender: {
			type: String,
			enum: {
				values: ['Male', 'Female', 'Other'],
				message: '{VALUE} is not supported',
			},
		},
		birthday: {
			type: Date,
			min: '1900-01-01',
			max: Date.now,
			validate: {
				validator: (value) => {
					return !isNaN(value);
				},
				message: 'Invalid date format',
			},
		},
		status: {
			type: String,
			enum: {
				values: ['Unconfimred', 'Confirmed'],
			},
			message: '{VALUE} is not supported',
		},
		slug: { type: String, slug: 'last_name', unique: true }, // Tự động tạo param để xem thông tin chi tiết
	},
	// Khởi tạo thời gian
	{
		timestamps: true,
	}
);

HotelManagementSchema.plugin(beautifyUnique);

const HotelManagement = mongoose.model('HotelManagement', HotelManagementSchema);

export default HotelManagement;
