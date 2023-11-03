import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const HotelSchema = new Schema(
	// Các thuộc tính của model Hotel
	{
		id: { type: mongoose.Types.ObjectId },
		id_hotel_management: { type: Schema.Types.ObjectId, ref: 'Hotel_Management', required: true },
		id_hotelType: { type: Schema.Types.ObjectId, ref: 'HotelType', required: true },
		id_famousPlace: { type: Schema.Types.ObjectId, ref: 'FamousPlace', required: true },
		name: {
			type: String,
			required: true,
			validate: {
				validator: (value) => value.length > 3,
				message: 'Must be at least 3 characters long',
			},
		},
		certificate: { type: String, required: true }, // Giấy phép kinh doanh
		tin: { type: String, required: true }, // Tax ID Number: Mã số thuế
		address: { type: String },
		phone: {
			type: String,
			maxLength: 11,
			required: true,
			validate: {
				validator: (value) => isNaN && value.length === 10,
				message: 'Phone number must be 10 characters long',
			},
		},
		number_star: { type: Number, required: false },
		rating: { type: Number, require: false },
		description: { type: String },
		regulations: { type: String, required: true },
		slug: { type: String, slug: 'name', unique: true }, // Tự động tạo param để xem thông tin chi tiết
	},
	// Khởi tạo thời gian
	{
		timestamps: true,
	}
);

// Thiếu trạng thái thanh toán phòng

const Hotel = mongoose.model('Hotel', HotelSchema);

export default Hotel;
