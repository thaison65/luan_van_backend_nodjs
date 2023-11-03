import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const PromotionSchema = new Schema(
	// Các thuộc tính của model Promotion
	{
		id: { type: mongoose.Types.ObjectId },
		id_employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: false },
		id_hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: false },

		name: {
			type: String,
			required: true,
			validate: {
				validator: (value) => value.length > 3,
				message: 'Must be at least 3 characters long',
			},
		},
		start_date: { type: Date, required: true },
		end_date: { type: Date, required: true },
		discount_type: {
			type: String,
			enum: {
				values: ['percentage', 'fixed'],
				// percentage: là giá trị %,
				// fixed: là tiền mặt
				message: '{VALUE} is not supported',
			},
			default: 'percentage',
			required: true,
		},
		discount: {
			type: Number,
			required: true,
			validate: {
				validator: (value) => {
					return value > 0;
				},
				message: 'Discount must be greater than 0',
			},
		},
		price_min: { type: Number, required: true }, // Mức tiền tối thiểu để có thể áp dụng
		price_max: { type: Number, required: true }, // Số tiền tối đa được giảm
		codition: {
			type: String,
			required: true,
			validate: {
				validator: (value) => {
					return value.length > 5;
				},
				message: 'Must be at least 5 characters long',
			},
		},
		description: { type: String },

		slug: { type: String, slug: 'name', unique: true }, // Tự động tạo param để xem thông tin chi tiết
	},
	// Khởi tạo thời gian
	{
		timestamps: true,
	}
);

const Promotion = mongoose.model('Promotion', PromotionSchema);

export default Promotion;
