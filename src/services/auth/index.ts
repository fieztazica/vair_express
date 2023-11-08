import axios, { AxiosError } from 'axios'
import { StrapiLoginLocal, StrapiRes } from 'strapiRes'
import AxiosService, { axiosDefaultConfig } from '../axios'
import { LoginSchema } from 'auth.types'

class AuthService extends AxiosService {
    constructor() {
        super('/auth', {
            ...axiosDefaultConfig,
            headers: { Authorization: undefined },
        })
    }
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
