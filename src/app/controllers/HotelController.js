import sharp from 'sharp';

import { MAX_RECORDS } from '../../Global/constants.js';
import { hotelRepository, userHotelRepository } from '../repositories/index.js';

class HotelController {
	//[POST] insert hotel
	insertHotet = async (req, res, next) => {
		const formData = req.body;
		const img_urls = [];

		let id = formData.id_hotel_management;
		const id_management = await userHotelRepository.getProfileUserHotel({ id });
		if (!id_management) {
			throw new Erroror('ID Hotel Manager is not');
		}
		try {
			const hotel = {
				$set: {
					id_hotel_management: formData.id_hotel_management,
					id_hotelType: formData.id_hotelType,
					id_famousPlace: formData.id_famousPlace,
					name: formData.name,
					abbreviations: formData.abbreviations,
					certificate: formData.certificate, // Giấy chứng nhận kinh doanh
					tin: formData.tin, // Mã số thuế
					address: formData.address,
					phone: formData.phone,
					number_star: formData.numberStar,
					rating: formData.rating,
					description: formData.description,
				},
			};

			const newHotel = await hotelRepository.insertHotel({ hotel });
			const id_hotel = newHotel._id;

			// Tạo mới các đối tượng hình ảnh từ danh sách file upload và gắn id_hotel vào
			for (const file of req.files) {
				const img_url = {
					data: file.buffer,
					contentType: file.mimetype,
				};
				const hotelImage = { id_hotel, img_url };
				const image = await hotelRepository.insertImage({ hotelImage });
				img_urls.push(image);
			}

			res.status(200).json({ message: 'Inserted hotel successfully' });
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};

	getHotel = async (req, res, next) => {
		const id = req.params.id;
		try {
			const newHotel = await hotelRepository.getHotel({ id });

			res.status(200).json({ message: `Get ID ${id} hotel successfully`, data: newHotel });
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};

	//[GET] Get all Hotels for client hotel-manager
	getAllHotels = async (req, res, next) => {
		const id = req.params.id;

		try {
			//http:localhost: 3065?page=1&size=100
			let { page = 1, size = MAX_RECORDS, searchString = '' } = req.query;
			size = size >= MAX_RECORDS ? MAX_RECORDS : size;

			let filteredHotels = await hotelRepository.getAllHotelsManagers({ id });

			const data = await Promise.all(
				filteredHotels.map(async (hotel) => {
					if (hotel !== undefined) {
						const { _id, id_hotelType } = hotel;

						const type = await hotelRepository.getIDType({ id_type: id_hotelType });
						const img = await hotelRepository.getImg({ id_hotel: _id });

						// if (!img) {
						// 	return hotel;
						// }
						// // Sử dụng thư viện sharp để xử lý hình ảnh
						// const buffer = img.img_url.data;
						// const contentType = img.img_url.contentType;
						// const image = await sharp(buffer)
						// 	.resize(700, 500) // Thay đổi kích thước hình ảnh
						// 	.toFormat('jpeg') // Chuyển đổi định dạng hình ảnh sang JPEG
						// 	.toBuffer(); // Chuyển đổi hình ảnh sang dạng buffer

						// // Thêm hình ảnh đã xử lý vào đối tượng khách sạn
						// const newImage = {
						// 	contentType: contentType,
						// 	data: image,
						// };

						const data = {
							...hotel._doc,
							id_hotelType: type,
							// img_url: newImage,
						};
						return data;
					}
				})
			);

			const filteredData = data.filter((hotel) => hotel !== null);

			res.status(200).json({
				message: 'Get hotel successfully',
				size: filteredHotels.length,
				page,
				searchString,
				data: filteredData,
			});
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};

	//[GET] Get all Hotels for client hotel-manager
	index = async (req, res, next) => {
		try {
			//http:localhost: 3065?page=1&size=100
			let { page = 1, size = MAX_RECORDS, searchString = '' } = req.query;
			size = size >= MAX_RECORDS ? MAX_RECORDS : size;

			let filteredHotels = await hotelRepository.getAllHotels({
				page,
				size,
				searchString,
			});

			res.status(200).json({
				message: 'Get hotel successfully',
				size: filteredHotels.length,
				page,
				searchString,
				data: filteredHotels,
			});
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};

	//[GET] get all images of hotel
	getAllImgofHotel = async (req, res, next) => {
		const id = req.params.id;

		try {
			let filteredHotelImage = await hotelRepository.getAllImg({ id });

			// Kiểm tra xem danh sách hình ảnh có tồn tại không
			if (!filteredHotelImage || filteredHotelImage.length === 0) {
				return res.status(404).send('Không tìm thấy hình ảnh');
			}

			// Tạo một mảng chứa tất cả các hình ảnh đã được xử lý
			const processedImages = [];
			for (let i = 0; i < filteredHotelImage.length; i++) {
				const hotelImage = filteredHotelImage[i];

				// Sử dụng thư viện sharp để xử lý hình ảnh
				const buffer = hotelImage.img_url.data;
				const contentType = hotelImage.img_url.contentType;
				const image = await sharp(buffer)
					.resize(700, 500) // Thay đổi kích thước hình ảnh
					.toFormat('jpeg') // Chuyển đổi định dạng hình ảnh sang JPEG
					.toBuffer(); // Chuyển đổi hình ảnh sang dạng buffer

				// Thêm hình ảnh đã xử lý vào mảng
				processedImages.push({
					contentType: contentType,
					data: image,
				});
			}

			res.status(200).json({
				message: `Get images of ${id} successfully`,
				size: filteredHotelImage.length,
				data: processedImages,
			});
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};

	// [POST] insert hotel type
	insertHotelType = async (req, res, next) => {
		try {
			const formData = req.body;
			const hotelType = {
				$set: {
					name: formData.name,
					description: formData.description,
				},
			};

			const newHotelType = await hotelRepository.insertHotelType({ hotelType });
			res.status(200).json({ message: 'Inserted hotel type successfully', data: newHotelType });
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};

	// [DELETE] delete hotel type
	deleteHotelType = async (req, res, next) => {
		const id = req.params.id;

		try {
			await hotelRepository.deleteHotelType({ id });
			res.status(200).json({ message: 'Delete hotel type successfully' });
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};

	// [GET] /hoteltypes
	hoteltypes = async (req, res, next) => {
		try {
			//http:localhost: 3065?page=1&size=100
			let { page = 1, size = MAX_RECORDS, searchString = '' } = req.query;
			size = size >= MAX_RECORDS ? MAX_RECORDS : size;

			let filteredHotelType = await hotelRepository.getAllHotelTypes({
				page,
				size,
				searchString,
			});
			res.status(200).json({
				message: 'Get hoteltypes successfully',
				size: filteredHotelType.length,
				page,
				searchString,
				data: filteredHotelType,
			});
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};
}

export default HotelController = new HotelController();
