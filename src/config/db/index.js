import mongoose from 'mongoose';

export async function connect() {
	try {
		console.log(process.env.MONGODB_URL);
		await mongoose.connect(process.env.MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			family: 4,
		});
		console.log('Connected to Mongodb');
	} catch (err) {
		throw new Error(`Cannot connect to Mongo. Error details: ${err}`);
	}
}
