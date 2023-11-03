import Hotel from '../models/Hotel.js';
import HotelImage from '../models/HotelImage.js';
import HotelType from '../models/HotelType.js';

const insertHotel = async ({ hotel }) => {
	try {
		const newHotel = await Hotel.create(hotel?.$set);
		console.log('Inserting hotel successfully');
		return newHotel;
	} catch (error) {
		throw new Error('Inserted hotel failed: ' + error.message);
	}
};

const updateHotel = async ({ id, hotel }) => {
	try {
		await Hotel.updateOne({ _id: id }, hotel?.$set);
		console.log('Updated hotel successfully');
	} catch (error) {
		throw new Error('Updated hotel failed: ' + error.message);
	}
};

const getHotel = async ({ id }) => {
	try {
		const newHotel = await Hotel.findById({ _id: id });
		return newHotel;
	} catch (error) {
		throw new Error(`Get ID ${id} of hotel failed: ${error.message}`);
	}
};

const getHotelIdPlace = async ({ id_place }) => {
	try {
		const newHotels = await Hotel.find({ id_famousPlace: id_place });
		return newHotels;
	} catch (error) {
		throw new Error(`Get ID place ${id_place} of Hotel failed: ${error.message}`);
	}
};

const getAllHotels = async ({ page, size, searchString }) => {
	try {
		page = parseInt(page);
		size = parseInt(size);
		//searchString? id, email, phone...

		// aggregate data for all hotel
		let filteredHotel = await Hotel.aggregate([
			{
				$match: {
					$or: [
						{
							name: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
						},
						{
							certificate: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
						},
						{
							tin: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
						},
						{
							address: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
						},
						{
							phone: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
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
		console.log('Get all hotel with paging');
		return filteredHotel;
	} catch (error) {
		throw new Error('Get all hotel failed: ' + error.message);
	}
};

const getAllHotelsManagers = async ({ id }) => {
	try {
		const hotel = await Hotel.find({ id_hotel_management: id });
		console.log('Get all hotel with paging');
		return hotel;
	} catch (error) {
		throw new Error('Get all hotel failed: ' + error.message);
	}
};

const insertImage = async ({ hotelImage }) => {
	try {
		const newHotelImage = await HotelImage.create(hotelImage);
		console.log('Inserting hotel image successfully');
		return newHotelImage;
	} catch (error) {
		throw new Error('Inserted hotel image failed: ' + error.message);
	}
};

const getAllImg = async ({ id_hotel }) => {
	try {
		const hotelImages = await HotelImage.find({ id_hotel: id_hotel }).select('img_url');
		console.log('Get all images of hotel with paging');
		return hotelImages;
	} catch (error) {
		throw new Error('Get all images of hotel failed: ' + error.message);
	}
};

const getImg = async ({ id_hotel }) => {
	try {
		const hotelImage = await HotelImage.findOne({ id_hotel: id_hotel }).select('img_url');
		console.log('Get hotel image with paging');
		return hotelImage;
	} catch (error) {}
};

const insertHotelType = async ({ hotelType }) => {
	try {
		const newHotelType = await HotelType.create(hotelType?.$set);
		console.log('Inserting hotel type successfully');
		return newHotelType;
	} catch (error) {
		throw new Error('Inserted hotel type failed: ' + error.message);
	}
};

const getIDType = async ({ id_type }) => {
	try {
		const newType = await HotelType.findById({ _id: id_type });
		return newType;
	} catch (error) {
		throw new Error(`Get ID ${id_type} hotel type failed: ${error.message}`);
	}
};

const deleteHotelType = async ({ id }) => {
	try {
		await HotelType.deleteOne({ _id: id });
		console.log('Deleted hotel type successfully');
	} catch (error) {
		throw new Error('Deleted hotel type failed: ' + error.message);
	}
};

const getAllHotelTypes = async ({ page, size, searchString }) => {
	try {
		page = parseInt(page);
		size = parseInt(size);
		//searchString? id, email, phone...

		// aggregate data for all hotelTypes
		let filteredHotelType = await HotelType.aggregate([
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
		console.log('Get all hotel type with paging');
		return filteredHotelType;
	} catch (error) {
		throw new Error('Get all hotel type failed: ' + error.message);
	}
};

export default {
	insertHotel,
	updateHotel,
	getHotel,
	getHotelIdPlace,
	getAllHotels,
	getAllHotelsManagers,
	insertImage,
	getAllImg,
	getImg,
	insertHotelType,
	getIDType,
	deleteHotelType,
	getAllHotelTypes,
};
