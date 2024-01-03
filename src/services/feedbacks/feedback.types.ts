import { UsersPermissionsUser } from '../auth/auth.types'
import { BoughtType } from '../boughts/boughts.types'

export type FeedbackType = {
    id: number
    comment: string
    recommend: boolean
    bought: BoughtType
    users_permissions_user: UsersPermissionsUser
}

export type CreateFeedbackType = {
    comment: string
    recommend: boolean
    users_permissions_user: string
    bought: string
}
