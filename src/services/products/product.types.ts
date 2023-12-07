export type ProductType = {
    name: string
    description: string
    price: number
    downloadUrl?: string
    publishedAt?: string | null
}

export type UploadProductType = {
    name: string
    description: string
    price: number
    banners?: Array<string>
    logo: string
    users_permissions_user?: string
    categories?: Array<string>
    downloadUrl: string
    developer: string
    publisher: string
    downloadCount?: number
    publishedAt?: string | null
}
