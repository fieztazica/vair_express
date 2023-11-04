import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import axios from 'axios'
import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'

type SocketNextCallback = (err?: ExtendedError) => void

const authUrl = `${process.env.STRAPI_URL as string}/api/users/me?populate=role`

// Create a middleware function for authorization
export const checkAuthorization = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization
        if (!token) {
            throw createHttpError.Unauthorized()
        }
        const authRes = await axios.get(authUrl, {
            headers: { Authorization: token },
        })
        if (!authRes) {
            throw createHttpError.Unauthorized()
        }
        if (
            !authRes.data?.role ||
            !authRes.data?.role?.name ||
            authRes.data.role.name != 'Developer'
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

export const socketAuthCheck = (socket: Socket, next: SocketNextCallback) => {
    const token = socket.handshake.auth.token
    const validateToken = async (token: string) => {
        try {
            const authRes = await axios.get(authUrl, {
                headers: { Authorization: token },
            })
            if (!authRes) {
                throw createHttpError.Unauthorized()
            }
            if (
                !authRes.data?.role ||
                !authRes.data?.role?.name ||
                authRes.data.role.name != 'Developer'
            ) {
                throw createHttpError.Unauthorized('You are not a developer')
            }
            next()
        } catch (error) {
            next(error)
        }
    }
    validateToken(token)
}
