export interface SuccessResponse<T = {}> {
    status: number,
    message: string,
    payload?: T
}

export interface ErrorResponse {
    status: number,
    message: string,
    payload: {
        error: Object
    }
}

export const INVALID_INPUT: ErrorResponse = {
    status: 400,
    message: "Invalid Input",
    payload: {
        error: {}
    }
}