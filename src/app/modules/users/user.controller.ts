import {  RequestHandler } from "express";
import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";




const createStudent = catchAsync(async (req, res, next) => {
   
  const {password, student: studentData } = req.body;
  const result = await UserServices.createStudentInToDB(password, studentData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true, 
    message: 'Student created successfully',
    data: result
  })

});


 export const UserControllers = {
    createStudent
  }