import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const StatusRoomSchema = new Schema(
	// Các thuộc tính của model StatusRoom
	{
		id_room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
		status: {
			type: String,
			enum: {
				values: ['Available', 'Unavailable', 'Reserved', 'Occupied'],
				// Available: Trạng thái phòng đã được đặt
				// Unavailable: Trạng thái phòng không khả dụng(bảo trì, tu sửa hoặc đã được đặt trước)
				// Reserved: Trạng thái phòng đã được xác nhận đặt phòng nhưng chưa thanh toán
				// Occupied: Trạng thái đang được sử dụng
				message: '{VALUE} is not supported',
			},
			default: 'Available',
			required: true,
		},
		start_date: {
			type: Date,
			required: true,
		},
		end_date: {
			type: Date,
			required: true,
		},
	}
);

const StatusRoom = mongoose.model('StatusRoom', StatusRoomSchema);

export default StatusRoom;
