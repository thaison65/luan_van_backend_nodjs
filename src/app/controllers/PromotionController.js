import { promotionRepository, hotelRepository } from '../repositories/index.js';

class PromotionController {
	insertOfHotel = async (req, res, next) => {
		const formData = req.body;
		const id_hotel = formData.id_hotel;

		try {
			await hotelRepository.getHotel({ id: id_hotel });

			const promotion = {
				$set: {
					id_hotel: formData.id_hotel,
					name: formData.name,
					start_date: formData.start_date,
					end_date: formData.end_date,
					discount_type: formData.discount_type,
					discount: formData.discount,
					price_min: formData.price_min,
					price_max: formData.price_max,
					codition: formData.codition,
					description: formData.description,
				},
			};

			const newPromotion = await promotionRepository.insertDiscountOfHotel({ promotion });
			res.status(200).json({ message: 'Inserted room type successfully', data: newPromotion });
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};

	getDiscountOfHotel = async (req, res, next) => {
		const { id_hotel } = req.body;

		try {
			const newDiscount = await promotionRepository.getDiscountOfHotel({ id_hotel });
			res.status(200).json({ message: 'Inserted room type successfully', data: newDiscount });
		} catch (error) {
			res.status(500).json({ message: error.toString() });
			next(error);
		}
	};
}

export default PromotionController = new PromotionController();
