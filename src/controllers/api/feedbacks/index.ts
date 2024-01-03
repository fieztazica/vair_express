import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import feedbackService from '../../../services/feedbacks'

const notFoundStatement = 'Feedback(s) not found'

export const getFeedbacksByProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const categoriesRes = await feedbackService.getFeedbacksByProductId(
            req.params.productId
        )
        res.status(200).json({ ...categoriesRes })
    } catch (error) {
        console.log(error.response.data)
        next(createHttpError(404, notFoundStatement))
    }
}

export const getFeedbacksByBought = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const categoriesRes = await feedbackService.getFeedbacksByBoughtId(
            req.params.boughtId
        )
        res.status(200).json({ ...categoriesRes })
    } catch (error) {
        console.log(error.response.data)
        next(createHttpError(404, notFoundStatement))
    }
}

