import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import productService from '../../../services/products'

/**
 * GET /
 * Home page.
 */
export const createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    res.json({ data: 'alo' })
}

export const getProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const productRes = await productService.getProductById(
            req.params.productId
        )
        res.status(200).json({ ...productRes })
    } catch (error) {
        console.log(error.response.data)
        next(createHttpError(404, 'Product not found'))
    }
}

