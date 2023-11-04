import { Request, Response } from 'express'

/**
 * GET /
 * Dev page.
 */
export const index = async (req: Request, res: Response): Promise<void> => {
    res.render('developers/login', { title: 'Developers' })
}

/**
 * GET /
 * Home page.
 */
export const createProductPage = async (req: Request, res: Response): Promise<void> => {
    res.render('developers/products/create-product', { title: 'Create Product | Developers' })
}
