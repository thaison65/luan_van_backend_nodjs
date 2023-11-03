import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Role_AccountSchema = new Schema(
	// Các thuộc tính của model Role_Account
	{
		id_role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
		id_account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
	}
);

const Role_Account = mongoose.model('Role_Account', Role_AccountSchema);
export default Role_Account;
