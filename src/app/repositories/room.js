import Room from '../models/Room.js';
import RoomType from '../models/RoomType.js';
import RoomImage from '../models/RoomImage.js';
import StatusRoom from '../models/StatusRoom.js';

const insertRoom = async ({ room }) => {
	try {
		const id_hotel = room.$set.id_hotel;
		const newRoomsOfHotel = await Room.find({ id_hotel: id_hotel });

		newRoomsOfHotel.map((value) => {
			if (room.$set.name == value.name) {
				throw new Error(`Because the ${room.$set.name} of this room is already in the hotel `);
			}
		});

		const newRoom = await Room.create(room?.$set);
		console.log('Inserting Room  successfully');
		return newRoom;
	} catch (error) {
		throw new Error('Inserted Room failed: ' + error.message);
	}
};

const getRoom = async ({ id }) => {
	try {
		const newRoom = await Room.findById({ _id: id });
		return newRoom;
	} catch (error) {
		throw new Error(`Get ${id} of Room failed: ${error.message}`);
	}
};

const getRooms = async ({ page, size, searchString }) => {
	try {
		page = parseInt(page);
		size = parseInt(size);
		//searchString? id, email, phone...

		// aggregate data for all RoomTypes
		let filteredRoom = await Room.aggregate([
			{
				$match: {
					$or: [
						{
							name: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
						},
					],
				}, // rỗng lấy hết
			},
			{
				$skip: (page - 1) * size, // số phần tử bỏ qua
			},
			{
				$limit: size, //Giới hạn bao nhiêu
			},
		]);
		console.log('Get all Room with paging');
		return filteredRoom;
	} catch (error) {
		throw new Error('Get all Room failed: ' + error.message);
	}
};

const getRoomsofHotel = async ({ id_hotel }) => {
	try {
		const newRoom = await Room.find({ id_hotel: id_hotel });
		return newRoom;
	} catch (error) {
		throw new Error(`Get all rooms of hotel ${id_hotel} failed: ${error.message}`);
	}
};

const insertRoomType = async ({ roomType }) => {
	try {
		const newRoomType = await RoomType.create(roomType?.$set);
		console.log('Inserting Room type successfully');
		return newRoomType;
	} catch (error) {
		throw new Error('Inserted Room type failed: ' + error.message);
	}
};

const deleteRoomType = async ({ id }) => {
	try {
		await RoomType.deleteOne({ _id: id });
		console.log('Deleted Room type successfully');
	} catch (error) {
		throw new Error('Deleted Room type failed: ' + error.message);
	}
};

const getTypeOfRoom = async ({ id }) => {
	try {
		const newType = await RoomType.findOne({ _id: id });
		return newType;
	} catch (error) {
		throw new Error(`Get ID of Room failed: ${error.message}`);
	}
};

const getAllRoomTypes = async ({ page, size, searchString }) => {
	try {
		page = parseInt(page);
		size = parseInt(size);
		//searchString? id, email, phone...

		// aggregate data for all RoomTypes
		let filteredRoomType = await RoomType.aggregate([
			{
				$match: {
					$or: [
						{
							name: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
						},
					],
				}, // rỗng lấy hết
			},
			{
				$skip: (page - 1) * size, // số phần tử bỏ qua
			},
			{
				$limit: size, //Giới hạn bao nhiêu
			},
		]);
		console.log('Get all Room type with paging');
		return filteredRoomType;
	} catch (error) {
		throw new Error('Get all Room type failed: ' + error.message);
	}
};

const insertStatusRoom = async ({ statusRoom }) => {
	try {
		const newStatus = await StatusRoom.create(statusRoom?.$set);
		console.log('Inserting status room successfully');
		return newStatus;
	} catch (error) {
		throw new Error('Inserted status room failed: ' + error.message);
	}
};

const getStatusOfRoom = async ({ id_room }) => {
	try {
		const newStatus = await StatusRoom.find({ id_room: id_room });
		return newStatus;
	} catch (error) {
		throw new Error(`Get all rooms of hotel ${id_room} failed: ${error.message}`);
	}
};

export default {
	insertRoom,
	getRoom,
	getRooms,
	getRoomsofHotel,
	insertRoomType,
	deleteRoomType,
	getTypeOfRoom,
	getAllRoomTypes,
	insertStatusRoom,
	getStatusOfRoom,
};
