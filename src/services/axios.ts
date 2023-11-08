import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { StrapiRes } from 'strapiRes'

const baseUrl = `${process.env.STRAPI_URL as string}`
const strapiToken = process.env.STRAPI_API_TOKEN as string

export const axiosDefaultConfig: AxiosRequestConfig = {
    baseURL: `${baseUrl}/api`,
    timeout: 10000,
    headers: { Authorization: `Bearer ${strapiToken}` },
}

class AxiosService {
    _instance: AxiosInstance
    constructor(extendBaseUrl?: string, config?: AxiosRequestConfig) {
        let defaultConfig = {
            ...axiosDefaultConfig,
        }
        if (config) {
            defaultConfig = {
                ...config,
            }
        }
        if (extendBaseUrl) defaultConfig.baseURL += extendBaseUrl
        this._instance = axios.create(defaultConfig)
    }

    async get<T = any>(url: string) {
        try {
            return await this._instance.get<T>(url)
        } catch (error) {
            return error as AxiosError<StrapiRes>
        }
    }

    async post<T = any>(url: string, data?: any) {
        try {
            return await this._instance.post<T>(url, data)
        } catch (error) {
            return error as AxiosError<StrapiRes>
        }
    }

    async put<T = any>(url: string, data?: any) {
        try {
            return await this._instance.put<T>(url, data)
        } catch (error) {
            return error as AxiosError<StrapiRes>
        }
    }

    async delete(url: string) {
        try {
            return await this._instance.delete(url)
        } catch (error) {
            return error as AxiosError<StrapiRes>
        }
    }
}

export default AxiosService
