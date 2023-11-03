import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const FavouriteSchema = new Schema(
	// Các thuộc tính của model Favourite
	{
		id: { type: mongoose.Types.ObjectId },
		id_customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
		id_hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, unique: true },
	},
	// Khởi tạo thời gian
	{
		timestamps: true,
	}
);

const Favourite = mongoose.model('Favourite', FavouriteSchema);

export default Favourite;
