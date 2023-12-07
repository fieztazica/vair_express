import { NextFunction, Request, Response } from 'express'
import authService from '../../services/auth'
import { StrapiErrorDetail } from 'strapiRes'
import { KeyConst } from '../../types/keyConst'
import productService from '../../services/products'
import categoryService from '../../services/categories'
import createHttpError from 'http-errors'
import uploadService from '../../services/uploads'
import { UploadProductType } from '../../services/products/product.types'

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
    try {
        const user = req.cookies[KeyConst.USER]
            ? JSON.parse(req.cookies[KeyConst.USER])
            : null
        if (!user) {
            res.redirect('/developers')
            return
        }

        const categoriesRes = await categoryService.getAllCategories()
        // console.log(categoriesRes.data)
        res.render('developers/products/create-product', {
            title: 'Create Product | Developers',
            categories: categoriesRes.data,
            message: null,
        })
    } catch (error) {
        res.render('developers/products/create-product', {
            title: 'Create Product | Developers',
            categories: [],
            message: null,
        })
    }
}

export const createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = req.cookies[KeyConst.USER]
            ? JSON.parse(req.cookies[KeyConst.USER])
            : null
        if (!user) {
            res.redirect('/developers')
            return
        }

        let message =
            'Successfully uploaded your product! Please wait while our staff are approving it.'
        const errors: string[] = []

        if (!req.file) {
            errors.push('Missing image file')
        }

        if (!req.file?.mimetype?.includes('image')) {
            errors.push('Not image file')
        }

        if (!req.body) {
            errors.push('Missing Body')
        }

        if (!req.body.downloadUrl) {
            errors.push('Missing Download Url')
        }

        if (errors.length) {
            message = errors.join(', ')
        } else {
            const uploadRes = await uploadService.uploadImage(req.file)
            const image = uploadRes.shift()
            const uploadProDto: UploadProductType = {
                name: req.body.productName,
                description: req.body.productDescription,
                developer: `1`,
                publisher: `1`,
                users_permissions_user: `${user.id}`,
                price: req.body.productPrice,
                downloadUrl: req.body.downloadUrl,
                logo: `${image.id}`,
                publishedAt: null,
            }
            const prodUpRes = await productService.createProduct(uploadProDto)
            console.log(prodUpRes.data)
        }

        res.render('developers/products/create-product', {
            title: 'Create Product | Developers',
            categories: [],
            message,
        })
    } catch (error) {
        console.error(error?.response?.data)
        next(createHttpError(500, `${error}`))
    }
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
        // console.log(productsRes.data)
        res.render('developers/products/list', {
            title: 'List Product | Developers',
            products: productsRes.data,
        })
    } catch (error) {
        console.error(error)
        res.render('developers/products/list', {
            title: 'List Product | Developers',
            products: [],
        })
    }
}
