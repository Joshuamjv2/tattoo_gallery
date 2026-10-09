import { Tag } from "./Tag"
import { PopupType } from "./Common"

export type TattooIdea = {
    id?: string,
    image?: string,
    tags?: Tag[] | string[],
    created?: Date
    updated?: Date
}


export type CreateTattooIdea = {
    tags?: string[] | Tag[]
    popup?: PopupType
}

export type UpdateTattooIdea = {
    popup: PopupType
}
