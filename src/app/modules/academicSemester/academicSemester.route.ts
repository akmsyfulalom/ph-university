import { Router } from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../middleware/validateRequest';
import { AcademicSemesterValidations } from './academicSemester.validation';

const router = Router();

router.post(
  '/create-academic-semester',
  validateRequest(AcademicSemesterValidations.createAcademicValidationSchema),
  AcademicSemesterControllers.createAcademicSemester,
);

router.get('/', AcademicSemesterControllers.getAllAcademicSemesters);
router.get('/:semesterId', AcademicSemesterControllers.getSingleAcademicSemester);

router.patch(
  '/:semesterId',
  validateRequest(AcademicSemesterValidations.updateAcademicValidationSchema),
  AcademicSemesterControllers.updateAcademicSemester,
);

export const academicSemesterRoutes = router;
