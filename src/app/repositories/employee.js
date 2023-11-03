import Employee from '../models/Employee.js';

const insertEmployee = async ({ employee }) => {
	try {
		const newEmployee = await Employee.create(employee?.$set);
		console.log('Inserting employee successfully');
		return newEmployee;
	} catch (error) {
		throw new Error('Inserted employee failed: ' + error.message);
	}
};

const updateEmployee = async ({ id, employee }) => {
	try {
		await Employee.updateOne({ _id: id }, employee?.$set);
		console.log('Updated employee successfully');
	} catch (error) {
		throw new Error('Updated employee failed: ' + error.message);
	}
};

const deleteEmployee = async ({ id }) => {
	try {
		await Employee.deleteOne({ _id: id });
		console.log('Deleted employee successfully');
	} catch (error) {
		throw new Error('Deleted employee failed: ' + error.message);
	}
};

const getProfileEmployee = async ({ id }) => {
	try {
		const employee = await Employee.findOne({ _id: id }).lean();
		if (!employee) {
			throw new Error('Cannot find employee with id ' + id);
		}
		console.log('Get employee successfully');
		return employee;
	} catch (error) {
		throw new Error('Get ID of employee failed: ' + error.message);
	}
};

const getAllEmployees = async ({ page, size, searchString }) => {
	try {
		page = parseInt(page);
		size = parseInt(size);
		//searchString? id, email, phone...

		// aggregate data for all employees
		let filteredEmployees = await Employee.aggregate([
			{
				$match: {
					$or: [
						{
							email: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
						},
						{
							last_name: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
						},
						{
							job_title: { $regex: `.*${searchString}.*`, $options: 'i' }, // ignore case
						},
					],
				}, // rỗng lấy hết
			},
			{
				$skip: (page - 1) * size, // số phần tử bỏ qua
			},
			{
				$limit: size, //Giới hạn bao nhiêu
			},
		]);
		console.log('Get all employees with paging');
		return filteredEmployees;
	} catch (error) {
		throw new Error('Get all employees failed: ' + error.message);
	}
};

export default {
	insertEmployee,
	updateEmployee,
	deleteEmployee,
	getProfileEmployee,
	getAllEmployees,
};
