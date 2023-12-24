import { Student } from './student.model';


const getAllStudentsFromDB = async () =>{ 
  const result = await Student.find().populate('admissionSemester').populate('addmissionDepartment')

  return result;
};

const getSingleStudentsFromDB = async (id: string) => {
  //   const result = await Student.findOne({ id });
  const result = await Student.aggregate([{ $match: { id: id } }]);
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};

export const studentServices = {
  getAllStudentsFromDB,
  getSingleStudentsFromDB,
  deleteStudentFromDB,
};
