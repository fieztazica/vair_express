export type StrapiError = {
    status: number
    name: string
    message: string
    details: any
}

export type StrapiRes<T = any> = {
    data?: T
    error?: StrapiError
}

export type StrapiErrorDetail = {
    path?: string[]
    message?: string
    name?: string
}

export type StrapiLoginLocal = {
    jwt: string
    user: StrapiUserLogin
}

export type StrapiUserLogin = {
    id: number
    username: string
    email: string
    provider: string
    confirmed: true
    blocked: boolean
    createdAt: string
    updatedAt: string
}
