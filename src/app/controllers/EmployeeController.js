import fs from 'fs';

import { MAX_RECORDS } from '../../Global/constants.js';
import { employeeRepository } from '../repositories/index.js';

class EmployeeController {
	// [POST] /addemployee
	create = async (req, res, next) => {
		try {
			const formData = req.body;
			const file = req.file;
			const employee = {
				$set: {
					first_name: formData.first_name,
					last_name: formData.last_name,
					card_id: formData.card_id,
					email: formData.email,
					phone: formData.phone,
					job_title: formData.job_title,
					address: formData.address,
					birthday: formData.birthday,
					img_url: { data: fs.readFileSync(file.path), contentType: file.mimetype },
					gender: formData.gender,
				},
			};

			const newEmployee = await employeeRepository.insertEmployee({ employee });
			res.status(200).json({ message: 'Inserted employee successfully', data: newEmployee });
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};

	//[PUT] update employee
	update = async (req, res, next) => {
		try {
			const formData = req.body;
			const file = req.file;
			const id = req.params.id;
			const employee = {
				$set: {
					first_name: formData.first_name,
					last_name: formData.last_name,
					card_id: formData.card_id,
					email: formData.email,
					phone: formData.phone,
					job_title: formData.job_title,
					address: formData.address,
					birthday: formData.birthday,
					img_url: { data: fs.readFileSync(file.path), contentType: file.mimetype },
					gender: formData.gender,
				},
			};
			await employeeRepository.updateEmployee({ id, employee });
			res.status(200).json({ message: 'Update employee successfully' });
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};

	// [DELETE] delete employee
	delete = async (req, res, next) => {
		try {
			const id = req.params.id;
			await employeeRepository.deleteEmployee({ id });
			res.status(200).json({ message: 'Delete employee successfully' });
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};

	// [GET] /:id
	profile = async (req, res, next) => {
		try {
			const id = req.params.id;
			const employee = await employeeRepository.getProfileEmployee({ id });
			res.status(200).json({ message: `Get _id: ${id} of Employee successfully`, data: employee });
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};

	// [GET] /employees
	index = async (req, res, next) => {
		try {
			//http:localhost: 3065?page=1&size=100
			let { page = 1, size = MAX_RECORDS, searchString = '' } = req.query;
			size = size >= MAX_RECORDS ? MAX_RECORDS : size;

			let filteredEmployees = await employeeRepository.getAllEmployees({
				page,
				size,
				searchString,
			});
			res.status(200).json({
				message: 'Get Employees successfully',
				size: filteredEmployees.length,
				page,
				searchString,
				data: filteredEmployees,
			});
		} catch (err) {
			res.status(500).json({ message: err.toString() });
			next(err);
		}
	};
}

export default EmployeeController = new EmployeeController();
