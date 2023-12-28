import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createStudentInToDB = async (password: string, payload: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given, use default password
  userData.password = password || (config.default_password as string);
  // set student role
  userData.role = 'student';



  // find academic semester info
  // const admissionsSemester = await AcademicSemester.findById(payload.admissionSemester);

  // // set generated is
  // userData.id = await generateStudentId(admissionsSemester);
  const admissionsSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    if (admissionsSemester) {
      userData.id = await generateStudentId(admissionsSemester);
    } else {
      // Handle the case where admissionsSemester is null
      console.error('Admissions semester not found');
    }
  
    // create a user (transaction-1)
    const newUser = await User.create([userData], {session});
  
    // create a student
    if (!newUser.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user')
    }
      // set id, _id as user
      payload.id = newUser[0].id; // embading id
      payload.user = newUser[0]._id; // refarence _id
      // create a new student (transaction-2)
      const newStudent = await Student.create([payload], {session});
      if(!newStudent.length){
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student')
      }

      await session.commitTransaction();
      session.endSession()
      return newStudent;
  
  } catch (error: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(error)
  }
}

  

export const UserServices = {
  createStudentInToDB,
}
