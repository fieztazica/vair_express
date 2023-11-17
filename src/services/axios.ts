import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios'
import { StrapiRes } from 'strapiRes'

const baseUrl = `${process.env.STRAPI_URL as string}`
const strapiToken = process.env.STRAPI_API_TOKEN as string

export const axiosDefaultConfig: AxiosRequestConfig = {
    baseURL: `${baseUrl}/api`,
    timeout: 10000,
    headers: { Authorization: `Bearer ${strapiToken}` },
}

class AxiosService {
    private instance: AxiosInstance
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
        const instance = axios.create({ ...defaultConfig })
        Object.assign(instance, this.setupInterceptorsTo(instance))
        this.instance = instance
    }

    async get<T = any>(url: string) {
        return (await this.instance.get<T>(`${url}`)) as T
    }

    async post<T = any>(url: string, data?: any) {
        return (await this.instance.post<T>(url, data)) as T
    }

    async put<T = any>(url: string, data?: any) {
        return await this.instance.put<T>(url, data)
    }

    async delete(url: string) {
        return await this.instance.delete(url)
    }

    private onRequest = async (config: AxiosRequestConfig) => {
        return config
    }

    private onRequestError = (error: AxiosError): Promise<AxiosError> => {
        console.error(`[request error] [${JSON.stringify(error)}]`)
        return Promise.reject(error)
    }

    private onResponse = (response: AxiosResponse) => {
        return response.data
    }

    private onResponseError = (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(error)
    }

    private setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
        axiosInstance.interceptors.request.use(
            // @ts-ignore
            this.onRequest,
            this.onRequestError
        )
        axiosInstance.interceptors.response.use(
            this.onResponse,
            this.onResponseError
        )
        return axiosInstance
    }
}

export default AxiosService
