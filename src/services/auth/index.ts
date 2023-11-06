import axios, { AxiosError } from 'axios'
import { StrapiLoginLocal, StrapiRes } from 'strapiRes'

const baseUrl = process.env.STRAPI_URL as string

type LoginSchema = {
    identifier: string
    password: string
}

class AuthService {
    _instance = axios.create({
        baseURL: `${baseUrl}/api/auth`,
    })
    async localLogin(data: LoginSchema) {
        try {
            return await this._instance.post<StrapiLoginLocal>('/local', data)
        } catch (error) {
            return error as AxiosError<StrapiRes>
        }
    }
}

const authService = new AuthService()

export default authService
