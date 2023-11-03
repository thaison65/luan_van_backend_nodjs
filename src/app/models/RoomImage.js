import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RoomImageSchema = new Schema(
	// Các thuộc tính của model RoomImage
	{
		id: { type: mongoose.Types.ObjectId },
		id_room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
		img_url: {
			type: String,
			required: false,
		},
	},
	// Khởi tạo thời gian
	{
		timestamps: true,
	}
);

const RoomImage = mongoose.model('RoomImage', RoomImageSchema);

export default RoomImage;
