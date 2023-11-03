import jwt from 'jsonwebtoken';
import GooglePlusTokenStrategy from 'passport-google-plus-token';

const checkToken = (req, res, next) => {
	// Bypass the check token login and register (Không check token của login và register)

	if (
		req.url.toLowerCase().trim() == '/api/auths/login'.toLowerCase().trim() ||
		req.url.toLowerCase().trim() == '/api/auths/register'.toLowerCase().trim() ||
		req.url.toLowerCase().trim() == '/api/customers/login'.toLowerCase().trim() ||
		req.url.toLowerCase().trim() == '/api/customers/register'.toLowerCase().trim() ||
		req.url.toLowerCase().trim() == '/api/hotels/users/login'.toLowerCase().trim() ||
		req.url.toLowerCase().trim() == '/api/hotels/users/register'.toLowerCase().trim() ||
		req._parsedUrl.pathname.toLowerCase().trim() == '/api/bookings/search'.toLowerCase().trim() ||
		req._parsedUrl.pathname.toLowerCase().trim() == '/api/places/cities/search'.toLowerCase().trim()
	) {
		next();
		return;
	}

	// orther requests
	// get and validate token
	const token = req.headers?.authorization?.split(' ')[1];

	try {
		const jwtObject = jwt.verify(token, process.env.JWT_SECRET);
		const isExpired = Date.now() >= jwtObject.exp * 1000;
		if (isExpired) {
			res.status(400).json({ message: 'Token is expired' });
			res.end();
		} else {
			next();
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export { checkToken };
