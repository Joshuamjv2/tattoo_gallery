import request from "../utils/network"
import { Tag } from "../types/Tag"

export const get_tags = async () => request({
    method: "GET",
    url: "/tags"
})

export const get_tag = async (id: string) => request({
    method: "GET",
    url: `/tags/${id}`
})

export const create_tag = async (data: Tag) => request({
    method: "POST",
    url: "/tags",
    data: data
})

export const delete_tag = async (id: string) => request({
    method: "DELETE",
    url: `/tags/${id}`
})


export const update_tag = async (data: Tag, id: string) => request({
    method: "PATCH",
    url: `/tags/${id}`,
    data: data
})