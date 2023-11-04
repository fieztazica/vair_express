import { Request, Response } from 'express'

/**
 * GET /
 * Home page.
 */
export const index = async (req: Request, res: Response): Promise<void> => {
    res.render('index', { title: 'ao ko' })
}

/**
 * GET /
 * Home page.
 */
export const about = async (req: Request, res: Response): Promise<void> => {
    res.render('about', { title: 'About Page', layout: './layouts/sidebar' })
}
