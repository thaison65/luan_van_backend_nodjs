import express from 'express';
import multer from 'multer';

const router = express.Router();

import employeeController from '../app/controllers/EmployeeController.js';

const upload = multer();

router.post('/add', upload.single('img_url'), employeeController.create);
router.put('/update/:id', upload.single('img_url'), employeeController.update);
router.delete('/delete/:id', employeeController.delete);
router.get('/:id', employeeController.profile);
router.get('/', employeeController.index);

export default router;
