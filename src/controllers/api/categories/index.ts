import createHttpError from 'http-errors'
import { NextFunction, Request, Response } from 'express'
import categoryService from '../../../services/categories'
import productService from '../../../services/products'

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

export const getProductbyCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const productRes = await productService.getProductbyCategory(
            req.params.category
        )
        res.status(200).json({ ...productRes })
    } catch (error) {
        console.log(error.response.data)
        next(createHttpError(404, 'Product not found'))
    }
}
