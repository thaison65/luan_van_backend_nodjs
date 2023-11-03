import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const HotelSchema = new Schema(
	// Các thuộc tính của model Hotel
	{
		id: { type: mongoose.Types.ObjectId },
		id_booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
		id_customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
		date: { type: Date, default: Date.now },
		status: {
			type: String,
			enum: {
				values: ['Unpaid', 'Processing', 'Paid', 'Payment failed', 'Refund pending', 'Refunded'],
				// Unpaid: Trạng thái chưa thanh toán
				// Processing: Trạng thái đang xử lý
				// Paid: Trạng thái thanh toán thành công
				// Payment failed: Trạng Thái thanh toán thất bại
				// Refund pending: Trạng thái chờ hoàn tiền
				// Refunded: Trạng thái hoàn tiền thành công
				message: '{VALUE} is not supported',
			},
		},

		// Payment-method: Phương thức thanh toán ['']

		//

		slug: { type: String, slug: 'last_name', unique: true }, // Tự động tạo param để xem thông tin chi tiết
	},
	// Khởi tạo thời gian
	{
		timestamps: true,
	}
);

const Hotel = mongoose.model('Hotel', HotelSchema);

export default Hotel;
