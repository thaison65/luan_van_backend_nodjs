import fetch from 'node-fetch';
const base = 'https://api-m.sandbox.paypal.com';

const createOrder = async (data) => {
	const accessToken = await generateAccessToken();
	debugger;
	const url = `${base}/v2/checkout/orders`;
	const response = await fetch(url, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({
			intent: 'CAPTURE',
			purchase_units: [
				{
					amount: {
						currency_code: 'USD',
						value: data.product.price,
					},
				},
			],
		}),
	});

	return handleResponse(response);
};

const capturePayment = async (orderId) => {
	const accessToken = await generateAccessToken();
	const url = `${base}/v2/checkout/orders/${orderId}/capture`;
	const response = await fetch(url, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return handleResponse(response);
};

const generateAccessToken = async () => {
	const CLIENT_ID = process.env.CLIENT_ID;
	const APP_SECRET = process.env.APP_SECRET;
	const auth = Buffer.from(CLIENT_ID + ':' + APP_SECRET).toString('base64');
	const response = await fetch(`${base}/v1/oauth2/token`, {
		method: 'post',
		body: 'grant_type=client_credentials',
		headers: {
			Authorization: `Basic ${auth}`,
		},
	});

	const jsonData = await handleResponse(response);
	return jsonData.access_token;
};

const handleResponse = async (response) => {
	if (response.status === 200 || response.status === 201) {
		return response.json();
	}

	const errorMessage = await response.text();
	throw new Error(errorMessage);
};

export default { createOrder, capturePayment };
