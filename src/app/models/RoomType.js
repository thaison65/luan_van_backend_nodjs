import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RoomTypeSchema = new Schema(
	// Các thuộc tính của model RoomType
	{
		id: { type: mongoose.Types.ObjectId },
		name: {
			type: String,
			required: true,
			validate: {
				validator: (value) => value.length > 0,
				message: 'Must be at least 0 characters long',
			},
		},
		description: { type: String },
	}
);

const RoomType = mongoose.model('RoomType', RoomTypeSchema);

export default RoomType;
