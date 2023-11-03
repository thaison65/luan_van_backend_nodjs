import Promotion from '../models/Promotion.js';

const insertDiscountOfHotel = async ({ promotion }) => {
	try {
		await Promotion.create(promotion?.$set);
	} catch (error) {
		throw new Error('Insert promotion for Hotel failed: ' + error.message);
	}
};

const getDiscountOfHotel = async ({ id_hotel }) => {
	try {
		const newPromotion = await Promotion.find({ id_hotel: id_hotel });
		return newPromotion;
	} catch (error) {
		throw new Error(`Get Discount of ID ${id_hotel} failded: ${error.message} `);
	}
};

export default { insertDiscountOfHotel, getDiscountOfHotel };
