import { Tag } from "./Tag"
import { PopupType } from "./Common"

export type Portfolio = {
    id?: string,
    image?: string,
    tags?: Tag[] | string[],
    created?: Date
    updated?: Date
}


export type CreatePortfolio = {
    artist: string
    tags?: string[] | Tag[]
    popup?: PopupType
}

export type UpdatePortfolio = {
    popup: PopupType
}
