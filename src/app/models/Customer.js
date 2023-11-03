import mongoose from 'mongoose';
import beautifyUnique from 'mongoose-beautiful-unique-validation';
import pkg from 'validator';
const { isEmail } = pkg;

import slug from 'mongoose-slug-updater';

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
	// Các thuộc tính của model Customer
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
		phone: {
			type: String,
			maxLength: 11,
			required: true,
			validate: {
				validator: (value) => isNaN && value.length === 10,
				message: 'Phone number must be 10 characters long',
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
		password: {
			type: String,
			required: true,
			validate: {
				validator: (value) => value.length > 8,
				message: 'Password must be at least 8 characters and contain only',
			},
		},
		gender: {
			type: String,
			enum: {
				values: ['Male', 'Female', 'Other'],
				message: '{VALUE} is not supported',
			},
			required: false,
		},
		img_url: {
			type: String,
			required: false,
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
			default: new Date().setFullYear(new Date().getFullYear() - 16, 0, 1),
			required: false,
		},
		slug: { type: String, slug: 'last_name', unique: true }, // Tự động tạo param để xem thông tin chi tiết
	},
	// Khởi tạo thời gian
	{
		timestamps: true,
	}
);

CustomerSchema.plugin(beautifyUnique);

const Customer = mongoose.model('Customer', CustomerSchema);

export default Customer;
