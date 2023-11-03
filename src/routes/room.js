import express from 'express';
import { body } from 'express-validator';

import roomController from '../app/controllers/RoomController.js';

const router = express.Router();

// roomtypes
router.post('/types/insert', roomController.insertRoomType);
router.delete('/types/delete/:id', roomController.deleteRoomType);
router.get('/types', roomController.roomtypes);

//status
router.post('/status/insert', roomController.insertStatus);

router.get('/managers/:id', roomController.getAllRoomManager);

// rooms
router.post('/insert', roomController.insert);
router.get('/', roomController.index);

export default router;
