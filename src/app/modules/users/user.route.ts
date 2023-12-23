import { UserControllers } from './user.controller';
import { StudentZodValidations } from '../student/student.validation';
import validateRequest from '../../middleware/validateRequest';
import express from 'express';

const router = express.Router();


router.post(
  '/create-student',
  validateRequest(StudentZodValidations.createStudentZodValidationSchema),
  UserControllers.createStudent,
);

export const UserRoutes = router;
