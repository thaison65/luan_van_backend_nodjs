import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AmenitieSchema = new Schema(
	// Các thuộc tính của model Amenitie
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
		status: { type: Boolean, required: true },
		description: { type: String },
	},
	// Khởi tạo thời gian
	{
		timestamps: true,
	}
);

const Amenitie = mongoose.model('Amenitie', AmenitieSchema);

export default Amenitie;
