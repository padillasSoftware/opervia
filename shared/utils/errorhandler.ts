export const errorHandler = (statusCode: number, status: number, code: string, statusMessage: string) => {

    return createError({
        statusCode: statusCode,
        status: status,
        message: statusMessage,
        statusMessage: statusMessage,
        data: {
            code: code
        },
        stack: process.env.STAGE !== "prod" ? new Error().stack : ""
    })
}