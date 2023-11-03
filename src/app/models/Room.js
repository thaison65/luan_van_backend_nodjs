import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const RoomSchema = new Schema(
	// Các thuộc tính của model Room
	{
		id: { type: mongoose.Types.ObjectId },
		id_hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
		id_roomType: { type: Schema.Types.ObjectId, ref: 'RoomType', required: true },
		name: {
			type: String,
			required: true,
			validate: {
				validator: (value) => value.length > 0,
				message: 'Must be at least 0 characters long',
			},
		},
		price: {
			type: Number,
			required: true,
			validate: {
				validator: (value) => value > 1000,
				message: 'Price is not Viet Nam Dong',
			},
		},
		phone: {
			type: String,
			maxLength: 11,
			required: false,
			validate: {
				validator: (value) => isNaN && value.length === 10,
				message: 'Phone number must be 10 characters long',
			},
		},
		capacity: { type: Number, required: true, min: 1 },
		beds: { type: Number, required: true, min: 1 },
		description: { type: String },
		slug: { type: String, slug: 'name', unique: true }, // Tự động tạo param để xem thông tin chi tiết
	},
	// Khởi tạo thời gian
	{
		timestamps: true,
	}
);

const Room = mongoose.model('Room', RoomSchema);

export default Room;
