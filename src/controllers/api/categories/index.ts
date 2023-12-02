import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import categoryService from '../../../services/categories'

export const getCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> =>{
    try {
        const categoriesRes = await categoryService.getAllCategories()
        res.status(200).json({ ...categoriesRes })
    } catch (error) {
        console.log(error.response.data)
        next(createHttpError(404, 'Product not found'))
    }
}
