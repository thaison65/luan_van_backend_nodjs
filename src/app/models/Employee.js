import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';
import beautifyUnique from 'mongoose-beautiful-unique-validation';

import pkg from 'validator';
const { isEmail } = pkg;

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const EmployeeSchema = new Schema(
	// Các thuộc tính của model Employee
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
		img_url: {
			type: String,
			required: false,
		},
		gender: {
			type: String,
			enum: {
				values: ['Male', 'Female', 'Other'],
				message: '{VALUE} is not supported',
			},
		},
		job_title: { type: String, required: false },
		address: { type: String, required: false },
		birthday: {
			type: Date,
			min: '1900-01-01',
			max: {
				value: () => {
					const maxDate = new Date();
					maxDate.setFullYear(maxDate.getFullYear() - 16);
					return maxDate;
				},
				message: 'Employee not less 16 years old',
			},
			default: new Date().setFullYear(new Date().getFullYear() - 18, 0, 1),
			required: true,
		},
		slug: { type: String, slug: `last_name`, unique: true }, // Tự động tạo param để xem thông tin chi tiết
	},
	// Khởi tạo thời gian
	{
		timestamps: true,
	}
);

EmployeeSchema.plugin(beautifyUnique);

const Employee = mongoose.model('Employee', EmployeeSchema);

export default Employee;
