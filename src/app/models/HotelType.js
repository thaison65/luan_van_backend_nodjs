import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const HotelTypeSchema = new Schema(
	// Các thuộc tính của model HotelType
	{
		id: { type: mongoose.Types.ObjectId },
		name: {
			type: String,
			required: true,
			validate: {
				validator: (value) => value.length > 3,
				message: 'Must be at least 3 characters long',
			},
		},
		description: { type: String },
	}
);

const HotelType = mongoose.model('HotelType', HotelTypeSchema);

export default HotelType;
