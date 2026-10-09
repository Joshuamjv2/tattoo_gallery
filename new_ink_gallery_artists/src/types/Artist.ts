import { PopupType } from "./Common";

export type Artist = {
    id?: string
    name: string
    instagram: string
    image?: string
    style?: string
    go_reminders_id?: number
    description?: string
    crated_at?: Date
    updated_at?: Date
    popup?: PopupType
    go_reminders_id?: number
}

export type UpdateDesign = {
    popup: PopupType
}

export type CreateArtist = {
    name?: string
    instagram?: string
    image?: string
    style?: string
    description?: string
    go_reminders_id?: number
}