import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import productService from '../../../services/products'
import path from 'path'
import fs from 'fs'
import { KeyConst } from '../../../types/keyConst'
import boughtService from '../../../services/boughts'

// Create a directory to store uploaded files
const uploadDir = path.join(__dirname, '../../../../uploads')

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
        console.error(error.response.data)
        next(createHttpError(404, 'Product not found'))
    }
}

export const downloadProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = res.locals.user
        const productId = req.params.productId

        const boughtRes = await boughtService.checkBought(productId, user.id)

        if (!boughtRes.data?.length) {
            next(createHttpError(404, 'Bought not found'))
            return
        }

        const productRes = await productService.getProductById(productId)

        if (productRes.data.downloadUrl) {
            const splittedPaths = productRes.data.downloadUrl.split('/')
            const fileName = splittedPaths.pop()
            const userId = splittedPaths.pop()
            const filePath = path.join(uploadDir, userId, fileName)

            // Check if the file exists
            if (fs.existsSync(filePath)) {
                res.download(filePath)
            } else {
                next(createHttpError(404, 'File not found'))
            }
        } else throw new Error('Empty download url')
    } catch (error) {
        next(createHttpError(500, `${error}`))
    }
}

export const buyProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = res.locals.user
        const productId = req.params.productId

        const boughtRes = await boughtService.checkBought(productId, user.id)

        const productRes = await productService.getProductById(productId)

        if (!!boughtRes.data?.length) {
            res.status(200).json({
                ...boughtRes.data.shift(),
            })
            return
        }

        const newBoughtRes = await productService.buy(
            `${productRes.data.id}`,
            `${user.id}`,
            productRes.data.price
        )

        res.status(200).json({
            ...newBoughtRes,
        })

        // if (productRes.data.downloadUrl) {
        //     const splittedPaths = productRes.data.downloadUrl.split('/')
        //     const fileName = splittedPaths.pop()
        //     const uploadUserId = splittedPaths.pop()
        //     const filePath = path.join(uploadDir, uploadUserId, fileName)

        //     // Check if the file exists
        //     if (fs.existsSync(filePath)) {
        //         res.download(filePath)
        //     } else {
        //         next(createHttpError(404, 'File not found'))
        //     }
        // } else throw new Error('Empty download url')
    } catch (error) {
        next(createHttpError(500, `${error}`))
    }
}

export const getProductsByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const productRes = await productService.getProductByCategory(
            req.params.category
        )
        res.status(200).json({ ...productRes })
    } catch (error) {
        console.error(error.response.data)
        next(createHttpError(404, 'Product not found'))
    }
}

export const getProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const productRes =
            req.query.category && typeof req.query.category === 'string'
                ? await productService.getProductByCategory(req.query.category)
                : await productService.getProducts()
        res.status(200).json({ ...productRes })
    } catch (error) {
        console.error(error.response.data)
        next(createHttpError(404, 'Products not found'))
    }
}
