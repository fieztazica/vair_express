import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import boughtService from '../../../services/boughts'

export const getBoughts = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = res.locals.user
        const boughtsRes = await boughtService.getBoughtsByUserId(`${user.id}`)
        res.status(200).json({ ...boughtsRes })
    } catch (error) {
        next(createHttpError(500, `${error}`))
    }
}
