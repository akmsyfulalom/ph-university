import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicDepartmentServices } from './academicDepartment.server';

const createAcademicDepartment = catchAsync(async (req, res, next) => {
  const result =
    await AcademicDepartmentServices.createAcademicDepartmentInToDB(req.body);
  
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic department are created successfully",
        data: result
    });
});


const getAllAcademicDepartment = catchAsync(async(req, res) =>{
    const result = await AcademicDepartmentServices.getAllAcademicDepartmentFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true, 
        message: "Academic department retrieved successfully!",
        data: result 
    })
})


const getSingleAcademicDepartment = catchAsync(async(req, res) =>{
    const { departmentId} = req.params;
    const result = await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(departmentId);
    sendResponse(res,{
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic department retrieved successfully!",
        data: result
    })
});


const updateAcademicDepartment = catchAsync(async(req, res) =>{
    const {departmentId} = req.params;
    const result = await AcademicDepartmentServices.updateAcademicDepartmentInToDB(departmentId, req.body);
sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic department updated successfully!",
    data: result
})

});


export const AcademicDepartmentControllers = {
    createAcademicDepartment,
    getAllAcademicDepartment,
    getSingleAcademicDepartment,
    updateAcademicDepartment
}
