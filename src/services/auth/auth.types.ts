export type LoginSchema = {
    identifier: string
    password: string
}

export type UsersPermissionsUser = {
    id: number
    username?: string
    email?: string
    provider?: string
    confirmed?: boolean
    blocked?: boolean
    createdAt?: string
    updatedAt?: string
}
