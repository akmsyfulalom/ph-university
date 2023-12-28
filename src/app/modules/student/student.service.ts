import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../users/user.model';
import { TStudent } from './student.interface';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
 
  const queryObj = { ...query };

 

  const studentSearchableFields = ['email', 'name.firstName', 'presentAddress'];
  let searchTerm = '';

  if (query?.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }

  const searchQuery = Student.find({
    $or: studentSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  });

  // filtering
  const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  excludeFields.forEach((el) => delete queryObj[el]);
  console.log( {query}, {queryObj});
  const filterQuery = searchQuery
    .find(queryObj)
    .populate('admissionSemester')
    .populate({
      path: 'addmissionDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  let sort = '-createdAt';
  if (query.sort) {
    sort = query.sort as string;
  }

  const sortQuery =  filterQuery.sort(sort);
  let skip = 0
  let page = 1
  let limit = 1;
  if (query.limit) {
    limit = Number(query.limit);
  }
  if(query.page ){
    page = Number(query.page)
    skip = (page-1)*limit
  }

  const paginateQuery = sortQuery.skip(skip)
  
  

  const limitQuery =  paginateQuery.limit(limit);


  let fields = '__v'

  if(query.fields){
    fields = (query.fields as string).split(',').join(' ');
    console.log(fields)
  }

const fieldsQuery = await  limitQuery.select(fields)

  return fieldsQuery;
};

const getSingleStudentsFromDB = async (id: string) => {
  //   const result = await Student.findOne({ id });
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'addmissionDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const updateStudentInToDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGurdian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGurdian && Object.keys(localGurdian).length) {
    for (const [key, value] of Object.entries(localGurdian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  console.log(modifiedUpdatedData);

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const result = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to deleted student!');
    }

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to deleted user!');
    }

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to delete student!');
  }
};

export const studentServices = {
  getAllStudentsFromDB,
  getSingleStudentsFromDB,
  updateStudentInToDB,
  deleteStudentFromDB,
};
