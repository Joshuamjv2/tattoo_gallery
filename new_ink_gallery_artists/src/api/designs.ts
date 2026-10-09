import request from "../utils/network"
import { CreateDesign, Design } from "../types/Design"

export const get_designs = async () => request({
    method: "GET",
    url: "/designs"
})

export const get_design = async (id: string) => request({
    method: "GET",
    url: `/designs/${id}`
})

export const create_design = async (data: CreateDesign) => request({
    method: "POST",
    url: "/designs",
    data: data
})

export const delete_design = async (id: string) => request({
    method: "DELETE",
    url: `/designs/${id}`
})


export const update_design = async (data: Design, id: string) => request({
    method: "PATCH",
    url: `/designs/${id}`,
    data: data
})