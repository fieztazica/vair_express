import { Request, Response } from 'express'
import authService from '../../services/auth'
import { StrapiErrorDetail } from 'strapiRes'
import { KeyConst } from '../../types/keyConst'
import productService from '../../services/products'

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
    try {
        const data = JSON.parse(JSON.stringify(req.body))

        const authRes = await authService.localLogin(data)
        res.cookie(KeyConst.TOKEN, authRes.jwt, {
            maxAge: 900000,
            httpOnly: true,
        })
        res.setHeader('Authorization', `Bearer ${authRes.jwt}`)
        res.redirect('/developers/products')
    } catch (error) {
        const errorDetails = error.response.data.error.details?.errors
            ? Object.values(error.response.data.error.details?.errors).map(
                  (v) => (v as StrapiErrorDetail).message
              )
            : []
        res.render('developers/login', {
            title: 'Developers',
            error: {
                message: `${error.response.data.error.message}${
                    errorDetails.length ? `: ${errorDetails.join(', ')}` : ''
                }`,
            },
        })
    }
}

export const createProductPage = async (
    req: Request,
    res: Response
): Promise<void> => {
    res.render('developers/products/create-product', {
        title: 'Create Product | Developers',
    })
}

export const createProduct = async (
    req: Request,
    res: Response
): Promise<void> => {
    res.redirect('/developers/products')
}

export const productListPage = async (
    req: Request,
    res: Response
): Promise<void> => {
    const user = req.cookies[KeyConst.USER]
        ? JSON.parse(req.cookies[KeyConst.USER])
        : null
    if (!user) {
        res.redirect('/developers')
        return
    }

    try {
        const productsRes = await productService.getProductListByDevId(user.id)
        console.log(productsRes.data)
        res.render('developers/products/list', {
            title: 'List Product | Developers',
            products: productsRes.data,
        })
    } catch (error) {
        console.log(error.response.data)
        res.render('developers/products/list', {
            title: 'List Product | Developers',
            products: [],
        })
    }
}
