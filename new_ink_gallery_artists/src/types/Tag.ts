import { PopupType } from "./Common";

export type Tag = {
    id?: string
    tag?: string
    crated_at?: Date
    updated_at?: Date
    popup?: PopupType
}

export type UpdateCompany = {
    popup: PopupType
}