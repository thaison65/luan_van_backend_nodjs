import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DetailsBookingSchema = new Schema(
	// Các thuộc tính của model DetailsBooking
	{
		id_booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
		id_room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
	}
);

const DetailsBooking = mongoose.model('DetailsBooking', DetailsBookingSchema);
export default DetailsBooking;
