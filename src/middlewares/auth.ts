import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import axios from 'axios'
import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'
import { KeyConst } from '../types/keyConst'
import { cookieValueFinder } from '../utils/cookies'

type SocketNextCallback = (err?: ExtendedError) => void

const authUrl = `${process.env.STRAPI_URL as string}/api/users/me?populate=role`

// Create a middleware function for authorization
export const checkAuthorization = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token =
            req.headers.authorization || `Bearer ${req.cookies[KeyConst.TOKEN]}`
        if (!token) {
            throw createHttpError.Unauthorized()
        }
        const authRes = await axios.get(authUrl, {
            headers: { Authorization: token },
        })
        if (!authRes) {
            throw createHttpError.Unauthorized()
        }

        if (authRes?.data) {
            res.cookie(KeyConst.USER, JSON.stringify(authRes.data), {
                maxAge: 900000,
                httpOnly: true,
            })
        }

        if (
            !authRes.data?.role ||
            !authRes.data?.role?.name ||
            authRes.data.role.name != KeyConst.DEVELOPER
        ) {
            throw createHttpError.Unauthorized('You are not a developer')
        }
        // console.log(authRes.data)
        next()
    } catch (error) {
        console.error(error.message)
        return res.status(error.status || 500).json({ error: error.message })
    }
}

export const checkAuthorizationView = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token =
            req.headers.authorization || `Bearer ${req.cookies[KeyConst.TOKEN]}`
        if (!token) {
            res.redirect('/developers')
        }
        const authRes = await axios.get(authUrl, {
            headers: { Authorization: token },
        })
        if (!authRes) {
            res.redirect('/developers')
        }

        if (authRes?.data) {
            res.cookie(KeyConst.USER, JSON.stringify(authRes.data), {
                maxAge: 900000,
                httpOnly: true,
            })
        }

        if (
            !authRes.data?.role ||
            !authRes.data?.role?.name ||
            authRes.data.role.name != KeyConst.DEVELOPER
        ) {
            res.redirect('/developers')
        }
        // console.log(authRes.data)
        next()
    } catch (error) {
        res.redirect('/developers')
    }
}

export const socketAuthCheck = (socket: Socket, next: SocketNextCallback) => {
    try {
        const token =
            'Bearer ' +
            cookieValueFinder(socket.handshake.headers.cookie, KeyConst.TOKEN)
        // socket.handshake.headers.cookie
        //     .split(/\s{0,}\;\s{0,}/g)
        //     .find((v) => v.includes(KeyConst.TOKEN))
        //     .split('=')[1]
        const validateToken = async (token: string) => {
            const authRes = await axios.get(authUrl, {
                headers: { Authorization: token },
            })
            if (!authRes) {
                throw new Error('You are not signed in.')
            }
            if (
                !authRes.data?.role ||
                !authRes.data?.role?.name ||
                authRes.data.role.name != KeyConst.DEVELOPER
            ) {
                throw new Error('You are not a developer')
            }
            next()
        }
        validateToken(token)
    } catch (error) {
        next(error?.response?.data?.error ?? error)
    }
}
