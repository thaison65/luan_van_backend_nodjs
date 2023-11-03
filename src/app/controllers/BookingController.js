import sharp from 'sharp';

import { MAX_RECORDS } from '../../Global/constants.js';
import {
	roomRepository,
	hotelRepository,
	bookingRepository,
	placeNameRepository,
	promotionRepository,
	userHotelRepository,
} from '../repositories/index.js';

class BookingController {
	//[GET] search hotel
	search = async (req, res, next) => {
		const {
			id_place = '',
			check_in_date = null,
			check_out_date = null,
			number_adults = 0,
			number_children = [],
			number_room = 0,
		} = req.query;

		try {
			if (
				id_place == '' ||
				check_in_date == null ||
				check_out_date == null ||
				number_adults == 0 ||
				number_room == 0
			) {
				throw new Error('Empty not !!');
			}

			// Convert data of query
			const checkindate = new Date(check_in_date);
			const checkoutdate = new Date(check_out_date);

			const timeDiff = Math.abs(checkoutdate.getTime() - checkindate.getTime());
			const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

			let children = [];
			if (number_children.length > 0) {
				children.push(JSON.parse(number_children));
			}
			const numberRoom = parseInt(number_room);

			// Xử lý lọc ra từng khách sạn theo vị trí
			const newHotels = await hotelRepository.getHotelIdPlace({ id_place });

			const filteredHotels = await Promise.all(
				// TÌm kiếm các phòng theo từng trạng thái ngày có trong 1 khách sạn
				newHotels.map(async (hotel) => {
					const id_hotel = hotel._id;
					const newRooms = await roomRepository.getRoomsofHotel({ id_hotel });
					const availableRooms = await Promise.all(
						newRooms.map(async (room) => {
							const id_room = room._id;
							const newStatus = await roomRepository.getStatusOfRoom({ id_room });
							const bookedRooms = newStatus.filter((status) => {
								const start = new Date(status.start_date);
								start.setHours(0, 0, 0, 0); // đặt giá trị giờ, phút, giây và mili giây về 0
								const end = new Date(status.end_date);
								end.setHours(0, 0, 0, 0);

								return (
									(start >= checkindate && start < checkoutdate) ||
									(end > checkindate && end <= checkoutdate) ||
									(start <= checkindate && end >= checkoutdate)
								);
							});
							const isAvailable = bookedRooms.length === 0;
							return isAvailable ? room : undefined;
						})
					);

					const filteredAvailableRooms = availableRooms.filter((room) => room !== undefined);

					const roomType = {};
					let number = numberRoom;
					filteredAvailableRooms.map((room) => {
						const { capacity, id_roomType } = room;

						// Tăng capacity cho loại phòng tương ứng với id_roomType
						if (number === 0) {
							return;
						}
						if (!roomType[id_roomType]) {
							number -= 1;
							roomType[id_roomType] = capacity;
						} else {
							number -= 1;
							roomType[id_roomType] += capacity;
						}
					});

					let priceHotel = 0;
					let number_room_child = numberRoom;

					const Rooms = filteredAvailableRooms.filter((room) => {
						if (number_room_child === 0) {
							return;
						}

						const totalGuests = children.reduce((total, childAge) => {
							return childAge >= 12 ? total + 1 : total;
						}, Number(number_adults));

						const { id_roomType, price } = room;
						if (roomType[id_roomType] >= totalGuests) {
							number_room_child -= 1;
							priceHotel += price;
						}

						return roomType[id_roomType] >= totalGuests;
					});

					const hotelWithPrice = {
						...hotel._doc,
						price: priceHotel * diffDays,
					};
					return Rooms.length > 0 ? hotelWithPrice : undefined;
				})
			);

			// Sơ lượt lại dữ liệu để trả kết quả
			let dataContent = [];
			const data = await Promise.all(
				filteredHotels.map(async (hotel) => {
					if (hotel !== undefined) {
						const { _id, id_famousPlace, id_hotelType } = hotel;

						const type = await hotelRepository.getIDType({ id_type: id_hotelType });
						const promotions = await promotionRepository.getDiscountOfHotel({ id_hotel: _id });
						const famous = await placeNameRepository.getIDFamous({ id_famous: id_famousPlace });

						const discounts = promotions.filter((promotion) => {
							return promotion.price_min <= hotel.price;
						});

						const maxDiscountProduct = discounts.reduce((max, discount) => {
							return discount.price_max > max.price_max ? discount : max;
						}, discounts[0]);

						const id_city = famous.id_city;
						const city = await placeNameRepository.getIDCity({ id_city });

						// const img = await hotelRepository.getImg({ id_hotel: _id });

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
							...hotel,
							discount: maxDiscountProduct,
							id_hotelType: type,
							id_famousPlace: {
								...famous._doc,
								id_city: city,
							},
							// img_url: newImage,
						};
						return data;
					}
				})
			);

			// Lọc bỏ các phần tử null trong mảng
			const filteredData = data.filter((hotel) => hotel !== null);

			res.status(200).json({
				message: 'Search hotel for booking successfully',
				zise: filteredData.length,
				data: filteredData,
			});
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};

	getHotel = async (req, res, next) => {
		const id = req.params.id;

		let { check_in_date = null, check_out_date = null } = req.query;

		try {
			if (check_in_date == null || check_out_date == null) {
				throw new Error('Empty not !!');
			}

			const checkindate = new Date(check_in_date);
			const checkoutdate = new Date(check_out_date);

			const timeDiff = Math.abs(checkoutdate.getTime() - checkindate.getTime());
			const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

			const newHotel = await hotelRepository.getHotel({ id });
			const id_hotel = newHotel._id;
			const id_hotel_management = newHotel.id_hotel_management;

			const promotions = await promotionRepository.getDiscountOfHotel({ id_hotel: id_hotel });

			const filterUserManager = await userHotelRepository.getProfileUserHotel({
				id: id_hotel_management,
			});

			const dataManagerment = {
				_id: filterUserManager._id,
				first_name: filterUserManager.first_name,
				last_name: filterUserManager.last_name,
				email: filterUserManager.email,
				phone: filterUserManager.phone,
				slug: filterUserManager.slug,
			};

			const filteredHotelRooms = await roomRepository.getRoomsofHotel({ id_hotel });

			const availableRooms = await Promise.all(
				filteredHotelRooms.map(async (room) => {
					const id_room = room._id;
					const newStatus = await roomRepository.getStatusOfRoom({ id_room });
					const bookedRooms = newStatus.filter((status) => {
						const start = new Date(status.start_date);
						start.setHours(0, 0, 0, 0); // đặt giá trị giờ, phút, giây và mili giây về 0
						const end = new Date(status.end_date);
						end.setHours(0, 0, 0, 0);

						return (
							(start >= checkindate && start < checkoutdate) ||
							(end > checkindate && end <= checkoutdate) ||
							(start <= checkindate && end >= checkoutdate)
						);
					});
					const isAvailable = bookedRooms.length === 0;
					return isAvailable ? room : undefined;
				})
			);

			const dataRooms = [];
			for (const room of availableRooms) {
				if (room != undefined) {
					const id_roomType = room.id_roomType;
					const newType = await roomRepository.getTypeOfRoom({ id: id_roomType });
					const data = { ...room._doc, id_roomType: newType };
					dataRooms.push(data);
				}
			}

			// Tạo một mảng chứa tất cả các hình ảnh đã được xử lý
			const filteredHotelImages = await hotelRepository.getAllImg({ id_hotel });

			let processedImages = [];
			for (let i = 0; i < filteredHotelImages.length; i++) {
				const hotelImage = filteredHotelImages[i];

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

			const data = {
				...newHotel._doc,
				id_hotel_management: dataManagerment,
				discount: promotions[0],
				daily: diffDays,
				rooms: dataRooms,
				images: processedImages,
			};

			res.status(200).json({ message: `Get ID ${id} hotel successfully`, data: data });
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};

	booking = async (req, res, next) => {
		const {
			id_customer = '',
			first_name = '',
			last_name = '',
			phone = '',
			email = '',
			name_customer = '',
			id_room = [],
			note = '',
			check_in_date = null,
			check_out_date = null,
			number_adults = 0,
			number_children = [],
			number_room = 0,
			total_price = '',
		} = req.body;

		try {
			// Tìm thông tin của Customer
			const dataBooking = {
				$set: {
					id_customer: id_customer,
					first_name: first_name,
					last_name: last_name,
					phone: phone,
					email: email,
					name_customer: name_customer,
					check_in_date: check_in_date,
					check_out_date: check_out_date,
					number_adults: number_adults,
					number_children: number_children.length,
					number_room: number_room,
					total_price: total_price,
					note: note,
					status: 'Pending',
				},
			};
			// Xử lý thêm vào
			const newBooking = await bookingRepository.insertBooking({ booking: dataBooking });
			const id_booking = newBooking.id;

			id_room.map(async (id) => {
				const detail = { $set: { id_booking: id_booking, id_room: id } };
				await bookingRepository.insertDetailsBooking({ detail });
			});

			res.status(200).json({ message: `Booking successfully`, data: newBooking });
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};

	confirm = async (req, res, next) => {
		// Token còn hiệu lực, cập nhật trạng thái booking
		const formDate = req.body;
		console.log(formDate);
		const { id_booking, id_rooms, check_in_date, check_out_date } = formDate;
		const data = { $set: { status: 'Booked' } };

		try {
			const booking = await bookingRepository.updateBooking({ id: id_booking, booking: data });
			id_rooms.map(async (id) => {
				const status = {
					$set: {
						id_room: id,
						status: 'Reserved',
						start_date: check_in_date,
						end_date: check_out_date,
					},
				};
				await bookingRepository.insertStatusRoom({ status });
			});
			res.status(200).json({ message: 'Booking is booked.', data: booking });
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};
}

export default BookingController = new BookingController();
