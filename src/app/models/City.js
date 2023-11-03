import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CitySchema = new Schema(
	// Các thuộc tính của model City
	{
		id: { type: mongoose.Types.ObjectId },
		code: { type: String, required: true, unique: true },
		name: {
			type: String,
			required: true,
			validate: {
				validator: (value) => value.length > 3,
				message: 'Must be at least 3 characters long',
			},
		},
		area: { type: String, required: true },
	}
);

const City = mongoose.model('City', CitySchema);

export default City;
