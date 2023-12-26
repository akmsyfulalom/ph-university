import { ZodError, ZodIssue } from "zod";
import { TErrorSource } from '../interface/error';

const handleZodError = (error: ZodError) =>{
    const statusCode = 400;
    const errorSources : TErrorSource = error.issues.map((issue: ZodIssue)=>{
      return {
        path: issue?.path[issue.path.length-1],
        message: issue.message
      }
    } )
    return {
      statusCode,
      message: 'Validation error',
      errorSources
    }
  }

  export default handleZodError;
