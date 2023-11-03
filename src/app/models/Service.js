import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ServiceSchema = new Schema(
	// Các thuộc tính của model Service
	{
		id: { type: mongoose.Types.ObjectId },
		id_hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
		name: {
			type: String,
			required: true,
			validate: {
				validator: (value) => value.length > 0,
				message: 'Must be at least 0 characters long',
			},
		},
		description: { type: String },
	},
	// Khởi tạo thời gian
	{
		timestamps: true,
	}
);

const Service = mongoose.model('Service', ServiceSchema);

export default Service;
