import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const HotelImageSchema = new Schema(
	// Các thuộc tính của model HotelImage
	{
		id: { type: mongoose.Types.ObjectId },
		id_hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
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

const HotelImage = mongoose.model('HotelImage', HotelImageSchema);

export default HotelImage;
