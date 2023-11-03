import { MAX_RECORDS } from '../../Global/constants.js';
import { roomRepository, hotelRepository } from '../repositories/index.js';

class RoomController {
	//[POST] insert room
	insert = async (req, res, next) => {
		try {
			debugger;
			const formData = req.body;
			const img_urls = [];

			let id = formData.id_hotel;
			const idHotel = await hotelRepository.getHotel({ id });
			if (!idHotel) {
				throw new Erroror('ID Hotel Manager is not');
			}

			const room = {
				$set: {
					id_hotel: formData.id_hotel,
					id_roomType: formData.id_roomType,
					name: formData.name,
					price: formData.price,
					phone: formData.phone,
					capacity: formData.capacity,
					beds: formData.beds,
					description: formData.description,
				},
			};

			const newRoom = await roomRepository.insertRoom({ room });
			// const id_room = newRoom._id;

			// // Tạo mới các đối tượng hình ảnh từ danh sách file upload và gắn id_room vào
			// for (const file of req.files) {
			// 	const img_url = {
			// 		data: file.buffer,
			// 		contentType: file.mimetype,
			// 	};
			// 	const roomImage = { id_room, img_url };
			// 	const image = await roomRepository.insertImage({ roomImage });
			// 	img_urls.push(image);
			// }

			res.status(200).json({ message: 'Inserted room successfully' });
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};

	//[GET] get all Rooms
	index = async (req, res, next) => {
		try {
			//http:localhost: 3065?page=1&size=100
			let { page = 1, size = MAX_RECORDS, searchString = '' } = req.query;
			size = size >= MAX_RECORDS ? MAX_RECORDS : size;

			let filteredRooms = await roomRepository.getRooms({
				page,
				size,
				searchString,
			});

			res.status(200).json({
				message: 'Get rooms successfully',
				size: filteredRooms.length,
				page,
				searchString,
				data: filteredRooms,
			});
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};

	getAllRoomManager = async (req, res, next) => {
		const id = req.params.id;

		try {
			const filteredHotels = await hotelRepository.getAllHotelsManagers({ id });

			const data = await Promise.all(
				filteredHotels.map(async (hotel) => {
					if (hotel !== undefined) {
						const { _id } = hotel;
						const rooms = await roomRepository.getRoomsofHotel({ id_hotel: _id });
						// trả về một đối tượng chứa thông tin của khách sạn và danh sách các phòng của nó
						return { hotel, rooms };
					}
				})
			);

			// lọc bỏ các phần tử undefined trong mảng kết quả
			const validData = data.filter((item) => item !== undefined);

			// lưu trữ danh sách các phòng của từng khách sạn vào biến dataRooms
			const dataRooms = validData.map((item) => item.rooms);

			res.status(200).json({ message: 'Get room for manager successfully', data: dataRooms });
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};

	// [POST] insert hotel type
	insertRoomType = async (req, res, next) => {
		try {
			const formData = req.body;
			const roomType = {
				$set: {
					name: formData.name,
					description: formData.description,
				},
			};

			const newRoomType = await roomRepository.insertRoomType({ roomType });
			res.status(200).json({ message: 'Inserted room type successfully', data: newRoomType });
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};

	// [DELETE] delete hotel type
	deleteRoomType = async (req, res, next) => {
		try {
			const id = req.params.id;
			await roomRepository.deleteRoomType({ id });
			res.status(200).json({ message: 'Delete room type successfully' });
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};

	// [GET] /hoteltypes
	roomtypes = async (req, res, next) => {
		try {
			//http:localhost: 3065?page=1&size=100
			let { page = 1, size = MAX_RECORDS, searchString = '' } = req.query;
			size = size >= MAX_RECORDS ? MAX_RECORDS : size;

			let filteredRoomType = await roomRepository.getAllRoomTypes({
				page,
				size,
				searchString,
			});

			res.status(200).json({
				message: 'Get roomtypes successfully',
				size: filteredRoomType.length,
				page,
				searchString,
				data: filteredRoomType,
			});
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};

	//[POST] insert StatusRoom
	insertStatus = async (req, res, next) => {
		try {
			const formData = req.body;

			const start_date = new Date(formData.start_date);
			const end_date = new Date(formData.end_date);

			const statusRoom = {
				$set: {
					id_room: formData.id_room,
					status: formData.status,
					start_date: start_date,
					end_date: end_date,
				},
			};

			const newStatus = await roomRepository.insertStatusRoom({ statusRoom });
			res.status(200).json({ message: 'Inserted status room successfully', data: newStatus });
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};
}

export default RoomController = new RoomController();
