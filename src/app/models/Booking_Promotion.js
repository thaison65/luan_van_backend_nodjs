import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Booking_PromotionSchema = new Schema(
	// Các thuộc tính của model Booking_Promotion
	{
		id_booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
		id_promotion: { type: Schema.Types.ObjectId, ref: 'Promotion', required: true },
	}
);

const Booking_Promotion = mongoose.model('Booking_Promotion', Booking_PromotionSchema);
export default Booking_Promotion;
