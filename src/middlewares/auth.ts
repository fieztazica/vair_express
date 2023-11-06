import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import axios from 'axios'
import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'
import { KeyConst } from '../types/keyConst'

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
        console.log(error.message)
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
    const token =
        'Bearer ' +
        socket.handshake.headers.cookie
            .split('; ')
            .find((v) => v.includes(KeyConst.TOKEN))
            .split('=')[1]
    const validateToken = async (token: string) => {
        try {
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
        } catch (error) {
            next(error?.response?.data?.error ?? error)
        }
    }
    validateToken(token)
}
