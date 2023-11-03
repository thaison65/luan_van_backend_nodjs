import { paypalRepository } from '../repositories/index.js';

class PayLoadController {
	createOrder = async (req, res, next) => {
		const formDate = req.body;

		try {
			const order = await paypalRepository.createOrder(formDate);
			res.json(order);
		} catch (err) {
			res.status(500).json({ message: err.toString() });
		}
	};

	capture = async (req, res, next) => {
		const { orderID } = req.body;
		try {
			const captureData = await paypalRepository.capturePayment(orderID);
			res.json(captureData);
		} catch (err) {
			res.status(500).json({ message: err.toString() });
		}
	};
}

export default PayLoadController = new PayLoadController();
