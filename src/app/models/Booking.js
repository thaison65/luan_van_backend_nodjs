import mongoose from 'mongoose';
import pkg from 'validator';
const { isEmail } = pkg;

const Schema = mongoose.Schema;

const BookingSchema = new Schema(
	// Các thuộc tính của model Booking
	{
		id: { type: mongoose.Types.ObjectId },
		id_customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
		first_name: {
			type: String,
			required: true,
			validate: {
				validator: (value) => value.length > 0,
				message: 'Must be at least 0 characters long',
			},
		},
		last_name: {
			type: String,
			required: true,
			validate: {
				validator: (value) => value.length > 0,
				message: 'Must be at least 0 characters long',
			},
		},
		email: {
			type: String,
			maxLength: 50,
			required: true,
			validate: {
				validator: isEmail,
				message: 'Email is inconrrect format',
			},
		},
		phone: {
			type: String,
			maxLength: 11,
			required: true,
			validate: {
				validator: (value) => isNaN && value.length === 10,
				message: 'Phone number must be 10 characters long',
			},
		},
		name_customer: { type: String, required: false }, // Tên khách hàng được đặt giúp
		booking_promotion: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Booking_Promotion',
				required: false,
			},
		],

		details_booking: [
			{
				type: Schema.Types.ObjectId,
				ref: 'DetailsBooking',
				required: false,
			},
		],

		check_in_date: {
			type: Date,
			required: true,
		},
		check_out_date: {
			type: Date,
			required: true,
		},
		number_adults: { type: Number }, // Số lượng người lớn
		number_children: { type: Number, required: false }, // Số lượng trẻ em
		number_room: { type: Number }, // Số lượng phòng
		total_price: { type: String }, // Số tiền thanh toán
		note: { type: String },
		status: {
			type: String,
			enum: {
				values: ['Booked', 'Confirmed', 'Pending', 'Cancelled', 'Completed'],
				// Booked: Trạng thái khi khách hàng đặt thành công nhưng chưa thanh toán
				// Confirmed: Trạng thái khi khách hàng đã xác nhận đặt phòng và thanh toán đơn đặt phòng
				// Pending: Trạng thái khách hàng chưa xác nhận đơn đặt phòng
				// Cancelled: Trạng thái hủy đặt phòng
				// Completed: Trạng Thái đơn đặt phòng đã hoàn thành (trả phòng)
				message: '{VALUE} is not supported',
			},
		},
	},
	// Khởi tạo thời gian
	{
		timestamps: true,
	}
);

const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;
