import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const FamousPlaceSchema = new Schema(
	// Các thuộc tính của model FamousPlace
	{
		id: { type: mongoose.Types.ObjectId },
		id_city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
		code: { type: String, required: true },
		name: {
			type: String,
			required: true,
			validate: {
				validator: (value) => value.length > 3,
				message: 'Must be at least 3 characters long',
			},
		},
	}
);

const FamousPlace = mongoose.model('FamousPlace', FamousPlaceSchema);

export default FamousPlace;
