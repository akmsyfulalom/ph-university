import httpStatus from 'http-status';
import { academicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';
import notFound from '../../middleware/notFound';
import AppError from '../../errors/AppError';

const createAcademicSemesterInToDB = async (payload: TAcademicSemester) => {
  // semester name ==> semester code
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new AppError(httpStatus.NOT_FOUND,'Invalid semester code!');
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

const getAllAcademicSemestersInToDB = async () => {
  const result = await AcademicSemester.find();
  return result;
};

const getSingleAcademicSemesterInToDB = async (id: string) => {
  const result = await AcademicSemester.findById(id);
  return result;
};

const updateAcademicSemesterInToDB = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new AppError(httpStatus.NOT_FOUND,'Invalid semester code');
  };
  const result = await AcademicSemester.findOneAndUpdate({_id:id}, payload, {new: true})

  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterInToDB,
  getAllAcademicSemestersInToDB,
  getSingleAcademicSemesterInToDB,
  updateAcademicSemesterInToDB
};
