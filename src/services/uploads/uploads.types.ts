type ImageType = {
    id: number
    name: string
    alternativeText?: string
    caption?: string
    width: number
    height: number
    formats?: {
        thumbnail?: Format
        small?: Format
        medium?: Format
        large?: Format
    }
    hash?: string
    ext?: string
    mime?: string
    size: number
    url: string
    previewUrl?: string
    provider?: string
    provider_metadata?: string
    createdAt?: string
    updatedAt?: string
}

type Format = {}
