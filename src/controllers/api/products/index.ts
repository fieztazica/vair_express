import { Request, Response } from 'express'

/**
 * GET /
 * Home page.
 */
export const create = async (req: Request, res: Response): Promise<void> => {
    res.json({ data: 'alo' })
}
