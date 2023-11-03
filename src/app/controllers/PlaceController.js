import { validationResult } from 'express-validator';

import fs from 'fs';

import { MAX_RECORDS } from '../../Global/constants.js';
import { placeNameRepository } from '../repositories/index.js';

class PlaceNameController {
	insert = async (req, res, next) => {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json({ error: error.array() });
		}

		const formData = req.body;

		const placeName = {
			$set: { name: formData.name, code: formData.code },
		};

		try {
			await placeNameRepository.insertPlaceName({ placeName });
			res.status(201).json({ message: 'Insert place name successfully' });
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};

	//[GET] get all placeNames
	index = async (req, res, next) => {
		try {
			//http:localhost: 3065?page=1&size=100
			let { page = 1, size = MAX_RECORDS, searchString = '' } = req.query;
			size = size >= MAX_RECORDS ? MAX_RECORDS : size;

			let filteredPlaces = await placeNameRepository.getAllPlaceNames({
				page,
				size,
				searchString,
			});
			res.status(200).json({
				message: 'Get Place Names successfully',
				size: filteredPlaces.length,
				page,
				searchString,
				data: filteredPlaces,
			});
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};

	update = async (req, res, next) => {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json({ error: error.array() });
		}

		const formData = req.body;
		const id = req.params.id;

		const placeName = {
			$set: { name: formData.name, code: formData.code },
		};

		try {
			await placeNameRepository.updatePlaceName({ id, placeName });
			res.status(200).json({ message: 'Update place name successfully' });
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};

	delete = async (req, res, next) => {
		try {
			const id = req.params.id;
			await placeNameRepository.deletePlaceName({ id });
			res.status(200).json({ message: 'Delete place names successfully' });
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};

	// [POST] insert City
	insertCity = async (req, res, next) => {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json({ error: error.array() });
		}

		const formData = req.body;

		const city = {
			$set: { name: formData.name, code: formData.code, area: formData.area },
		};

		try {
			const newCity = await placeNameRepository.insertCity({ city });
			res.status(201).json({ message: 'Insert city successfully', data: newCity });
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};

	//[GET] get all cities
	getCities = async (req, res, next) => {
		try {
			//http:localhost: 3065?page=1&size=100
			let { page = 1, size = MAX_RECORDS, searchString = '' } = req.query;
			size = size >= MAX_RECORDS ? MAX_RECORDS : size;

			let filteredCities = await placeNameRepository.getAllCities({
				page,
				size,
				searchString,
			});
			res.status(200).json({
				message: 'Get Cities successfully',
				size: filteredCities.length,
				page,
				searchString,
				data: filteredCities,
			});
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};

	//[POST] insert Famous Place
	insertFamous = async (req, res, next) => {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json({ error: error.array() });
		}

		const formData = req.body;

		const famous = {
			$set: { id_city: formData.id_city, name: formData.name },
		};

		try {
			const newFamous = await placeNameRepository.insertFamous({ famous });
			res.status(201).json({ message: 'Insert famous place successfully', data: newFamous });
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};

	//[GET] // Famous place for search Booking
	search = async (req, res, next) => {
		try {
			//http:localhost: 3065?page=1&size=100
			let { page = 1, size = MAX_RECORDS, searchString = '' } = req.query;
			size = size >= MAX_RECORDS ? MAX_RECORDS : size;

			let filteredFamous = await placeNameRepository.getAllFamous({
				page,
				size,
				searchString,
			});

			let filteredCities = await placeNameRepository.getAllCities({
				page,
				size,
				searchString,
			});

			const filteredSearch = [...filteredFamous, ...filteredCities];

			res.status(200).json({
				message: 'Search Famous place successfully',
				size: filteredSearch.length,
				page,
				searchString,
				data: filteredSearch,
			});
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};
}

export default PlaceNameController = new PlaceNameController();
