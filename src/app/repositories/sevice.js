import Service from '../models/Service.js';
import Amenitie from '../models/Amenitie.js';

const insertService = async ({ service }) => {
	try {
		const id_hotel = service.$set.id_hotel;
		const newHotel = await Service.find({ id_hotel: id_hotel });

		if (newHotel.name === service.$set.name) {
			throw new Error('Name service alray in Hotel');
		}

		await Service.create(service?.$set);
	} catch (error) {
		throw new Error('Insert service failed: ' + error.message);
	}
};

const deleteService = async ({ id }) => {
	try {
		await Service.deleteOne({ _id: id });
		console.log('Deleted service successfully');
	} catch (error) {
		throw new Error('Deleted service failed: ' + error.message);
	}
};

const getAllService = async ({ page, size, searchString }) => {
	try {
		page = parseInt(page);
		size = parseInt(size);
		//searchString? id, email, phone...

		// aggregate data for all service
		let filteredService = await Service.aggregate([
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
		console.log('Get all service with paging');
		return filteredService;
	} catch (error) {
		throw new Error('Get all service failed: ' + error.message);
	}
};

const insertAmenitie = async ({ amenitie }) => {
	try {
		const id_room = amenitie.$set.id_room;
		const newRoom = await Amenitie.find({ id_room: id_room });

		if (newRoom.name === amenitie.$set.name) {
			throw new Error('Name Amenitie alray in Hotel');
		}

		await Amenitie.create(amenitie?.$set);
	} catch (error) {
		throw new Error('Insert Amenitie failed: ' + error.message);
	}
};

const deleteAmenitie = async ({ id }) => {
	try {
		await Amenitie.deleteOne({ _id: id });
		console.log('Deleted Amenitie successfully');
	} catch (error) {
		throw new Error('Deleted Amenitie failed: ' + error.message);
	}
};

const getAllAmenitie = async ({ page, size, searchString }) => {
	try {
		page = parseInt(page);
		size = parseInt(size);
		//searchString? id, email, phone...

		// aggregate data for all Amenitie
		let filteredAmenitie = await Amenitie.aggregate([
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
		console.log('Get all Amenitie with paging');
		return filteredAmenitie;
	} catch (error) {
		throw new Error('Get all Amenitie failed: ' + error.message);
	}
};
export default {
	insertService,
	deleteService,
	getAllService,
	insertAmenitie,
	deleteAmenitie,
	getAllAmenitie,
};
