import City from '../models/City.js';
import FamousPlace from '../models/FamousPlace.js';

const insertCity = async ({ city }) => {
	const data = city.$set;
	let existingCity = await City.findOne({ code: data.code }).exec();
	if (!!existingCity) {
		throw new Error('Code of city already exists');
	}

	try {
		const newCity = await City.create(data);
		return { ...newCity._doc };
	} catch (error) {
		//check model validation here
		throw new Error('Cannot insert city');
	}
};

const getIDCity = async ({ id_city }) => {
	try {
		const newcity = await City.findById({ _id: id_city });
		return newcity;
	} catch (error) {
		throw new Error(`Get ID ${id} city failed:  ${error.message}`);
	}
};

const getAllCities = async ({ page, size, searchString }) => {
	try {
		page = parseInt(page);
		size = parseInt(size);
		//searchString? id, email, phone...

		// aggregate data for all Customers
		let filteredCities = await City.aggregate([
			{
				$match: {
					$or: [
						{
							code: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
						},
						{
							name: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
						},
						{
							area: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
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
		console.log('Get all Cities with paging');
		return filteredCities;
	} catch (error) {
		throw new Error('Get all Cities failed: ' + error.message);
	}
};

const insertFamous = async ({ famous }) => {
	const data = famous.$set;
	let existingFamousPlace = await FamousPlace.findOne({ name: data.name }).exec();
	if (!!existingFamousPlace) {
		throw new Error('Name of Famous place already exists');
	}

	try {
		const newFamousPlace = await FamousPlace.create(data);
		return { ...newFamousPlace._doc };
	} catch (error) {
		//check model validation here
		throw new Error('Cannot insert famous place');
	}
};

const getIDFamous = async ({ id_famous }) => {
	try {
		const newFamous = await FamousPlace.findById({ _id: id_famous });
		return newFamous;
	} catch (error) {
		throw new Error(`Get ID ${id} famous place failed:  ${error.message}`);
	}
};

const getAllFamous = async ({ page, size, searchString }) => {
	try {
		page = parseInt(page);
		size = parseInt(size);
		//searchString? id, email, phone...

		// aggregate data for all Customers
		let filteredFamous = await FamousPlace.aggregate([
			{
				$match: {
					$or: [
						{
							name: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
						},
						{
							code: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
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
			{
				$lookup: {
					from: 'cities',
					localField: 'id_city',
					foreignField: '_id',
					as: 'city',
				},
			},
			{
				$unwind: '$city',
			},
		]);

		let promises = filteredFamous.map(async (value) => {
			const id = value.id_city;
			console.log(id.toString());
			let existingCity = await City.findOne({ _id: id.toString() }).exec();
			if (!existingCity) {
				throw new Error('Code of city already exists');
			}

			let data = {
				$set: {
					_id: value._id,
					name: value.name,
					nameCity: existingCity.name,
					code: existingCity.code,
					area: existingCity.area,
				},
			};
			return data.$set;
		});

		let filtered = await Promise.all(promises);

		console.log('Get all Famous place with paging');
		return filtered;
	} catch (error) {
		throw new Error('Get all Famous place failed: ' + error.message);
	}
};

const insertPlaceName = async ({ placeName }) => {
	const data = placeName.$set;
	let existingCity = await City.findOne({ code: data.code }).exec();
	if (!existingCity) {
		throw new Error('Code of city not already exists');
	}
	const id_city = existingCity._id;

	const place = { ...data, id_city };

	try {
		const newPlaceName = await PlaceName.create(place);
		return { ...newPlaceName._doc };
	} catch (error) {
		throw new Error('Cannot register city');
	}
};

const getAllPlaceNames = async ({ page, size, searchString }) => {
	try {
		page = parseInt(page);
		size = parseInt(size);
		//searchString? id, email, phone...

		// aggregate data for all Customers
		let filteredPlaceNames = await PlaceName.aggregate([
			{
				$match: {
					$or: [
						{
							code: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
						},
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
		console.log('Get all PlaceNames with paging');
		return filteredPlaceNames;
	} catch (error) {
		throw new Error('Get all PlaceNames failed: ' + error.message);
	}
};

const updatePlaceName = async ({ id, placeName }) => {
	const data = placeName.$set;
	let existingCity = await City.findOne({ code: data.code }).exec();
	if (!!existingCity) {
		throw new Error('Code of city already exists');
	}

	try {
		await PlaceName.updateOne({ _id: id }, data);
		console.log('Updated place name successfully');
	} catch (error) {
		throw new Error('Updated place name failed: ' + error.message);
	}
};

const deletePlaceName = async ({ id }) => {
	try {
		await PlaceName.deleteOne({ _id: id });
		console.log('Deleted place name successfully');
	} catch (error) {
		throw new Error('Deleted place name failed: ' + error.message);
	}
};

export default {
	insertCity,
	getIDCity,
	getIDFamous,
	getAllCities,
	insertFamous,
	getAllFamous,
	insertPlaceName,
	getAllPlaceNames,
	updatePlaceName,
	deletePlaceName,
};
