import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const AccountSchema = new Schema(
	// Các thuộc tính của model Accout
	{
		id: { type: mongoose.Types.ObjectId },
		username: {
			type: String,
			maxLength: 50,
			required: true,
			unique: true,
			validate: {
				validator: (value) => /^[a-zA-Z0-9]+$/.test(value) && value.length > 5,
				message: 'Username must be at least 5 characters and contain only letters and numbers',
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
		id_employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true, unique: true },
		account_roles: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Role_Account',
				required: true,
			},
		],
		slug: { type: String, slug: 'username', unique: true }, // Tự động tạo param để xem thông tin chi tiết
	},
	// Khởi tạo thời gian
	{
		timestamps: true,
	}
);

const Account = mongoose.model('Account', AccountSchema);

export default Account;
