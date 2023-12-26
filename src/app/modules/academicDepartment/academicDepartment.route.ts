import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AcademicDepartmentValidations } from './academicDepartment.validation';
import { AcademicDepartmentControllers } from './academicDepartment.controller';

const router = Router();

router.post(
  '/create-academic-department',
  // validateRequest(
  //   AcademicDepartmentValidations.createAcademicDepartmentValidationSchema,
  // ),
  AcademicDepartmentControllers.createAcademicDepartment,
);

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartment);
router.get('/:departmentId', AcademicDepartmentControllers.getSingleAcademicDepartment);

router.patch('/:departmentId', AcademicDepartmentControllers.updateAcademicDepartment);

export const AcademicDepartmentRoutes = router;