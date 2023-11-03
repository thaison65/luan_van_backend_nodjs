import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RoleSchema = new Schema(
	// Các thuộc tính của model Role
	{
		id: { type: mongoose.Types.ObjectId },
		name: {
			type: String,
			maxLength: 50,
			required: true,
			validate: {
				validator: (value) => value.length > 5,
				message: 'Must be at least 5 characters long',
			},
		},
		admin: {
			type: Boolean,
			required: true,
			default: false,
		},
		description: {
			type: String,
			validate: {
				validator: (value) => value.length > 5,
				message: 'Must be at least 5 characters long',
			},
		},
	}
);

const Role = mongoose.model('Role', RoleSchema);
export default Role;
