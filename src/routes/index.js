import employeeRoute from './employee.js';
import accountRoute from './account.js';
import customerRoute from './customer.js';
import hotelRoute from './hotel.js';
import placeRoute from './place.js';
import roomRoute from './room.js';
import bookingRoute from './booking.js';
import promotionRoute from './promotion.js';

function route(app) {
	app.use('/api/employees', employeeRoute);
	app.use('/api/auths', accountRoute);
	app.use('/api/customers', customerRoute);
	app.use('/api/hotels', hotelRoute);
	app.use('/api/places', placeRoute);
	app.use('/api/rooms', roomRoute);
	app.use('/api/bookings', bookingRoute);
	app.use('/api/promotions', promotionRoute);
}

export default route;
