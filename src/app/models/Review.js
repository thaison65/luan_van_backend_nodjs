import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
	// Các thuộc tính của model Review
	{
		id: { type: mongoose.Types.ObjectId },
		id_hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, unique: true },
		id_customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
		rating: { type: Number },
		comment: { type: String },
		slug: { type: String, slug: `last_name`, unique: true }, // Tự động tạo param để xem thông tin chi tiết
	},
	// Khởi tạo thời gian
	{
		timestamps: true,
	}
);

const Review = mongoose.model('Review', ReviewSchema);

export default Review;
