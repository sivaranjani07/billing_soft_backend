import { Response } from 'express';
import { ApiResponse } from '../types/apiResponse';


export const sendResponse = <T>(
    res: Response<ApiResponse<T>>,
    data: T | null,
    message: string = 'Success',
    statusCode: number = 200
): Response<ApiResponse<T>> => {

    const isEmpty =
        (Array.isArray(data) && data.length === 0) ||
        (!Array.isArray(data) && Object.keys(data || {}).length === 0);

    let finalData = data;
    let finalMessage = message;

    if (statusCode == 407) {

        finalData = ([] as T);
        finalMessage = 'No data found';
        statusCode = 407;
    }

    // Default success structure
    if (statusCode === 200) {
        finalMessage = isEmpty ? 'No data found' : finalMessage;
    }

    if (statusCode === 201) {
        finalMessage = finalMessage ?? 'Created Successfully';
    }


    return res.status(statusCode).json({
        status: statusCode === 200 || 201 ? 'success' : 'fail',
        message: finalMessage,
        data: finalData,
    });
};


export const sendErrorResponse = (
    res: Response<ApiResponse<null>>,
    error: any = {},
    message: string = 'Something went wrong',
    statusCode: number = 500
): Response<ApiResponse<null>> => {
    const errorDetails = error instanceof Error ? error.message : error;
    return res.status(statusCode).json({
        status: 'error',
        message,
        error: errorDetails,
    });
};
