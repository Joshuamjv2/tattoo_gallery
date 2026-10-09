import { PopupType } from "./Common";
import { Tag } from "./Tag";

export type Design = {
    id?: string
    name?: string
    price?: number
    tags?: Tag[] | string[]
    images?: string[]
    description?: string
    crated_at?: Date
    updated_at?: Date
    popup?: PopupType
}


export type CreateDesign = {
    id?: string
    name: string
    price?: number
    tags?: string[] | Tag[]
    description?: string
    popup?: PopupType
}

export type UpdateDesign = {
    popup: PopupType
}