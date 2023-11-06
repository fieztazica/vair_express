import { Request, Response } from 'express'
import authService from '../../services/auth'
import { AxiosError } from 'axios'
import { StrapiErrorDetail } from 'strapiRes'
import { KeyConst } from '../../types/keyConst'

export const logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie(KeyConst.TOKEN)
    res.redirect('/developers')
}

export const loginPage = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies[KeyConst.TOKEN]
    if (token) {
        res.redirect('/developers/products')
        return
    }
    res.render('developers/login', { title: 'Vair Developers', error: {} })
}

export const loginSubmit = async (
    req: Request,
    res: Response
): Promise<void> => {
    const data = JSON.parse(JSON.stringify(req.body))

    const authRes = await authService.localLogin(data)
    if (authRes instanceof AxiosError) {
        const errorDetails = Object.values(
            authRes.response.data.error.details.errors
        ).map((v) => (v as StrapiErrorDetail).message)
        res.render('developers/login', {
            title: 'Developers',
            error: {
                message: `${authRes.response.data.error.message}${
                    errorDetails.length ? `: ${errorDetails.join(', ')}` : ''
                }`,
            },
        })
        return
    }

    res.cookie(KeyConst.TOKEN, authRes.data.jwt, {
        maxAge: 900000,
        httpOnly: true,
    })
    res.setHeader('Authorization', `Bearer ${authRes.data.jwt}`)
    res.redirect('/developers/products')
}

export const createProductPage = async (
    req: Request,
    res: Response
): Promise<void> => {
    res.render('developers/products/create-product', {
        title: 'Create Product | Developers',
    })
}

export const productListPage = async (
    req: Request,
    res: Response
): Promise<void> => {
    res.render('developers/products/list', {
        title: 'List Product | Developers',
    })
}
