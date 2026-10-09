import request from "../utils/network"
import { Portfolio, CreatePortfolio } from "../types/Portfolio"

export const get_artist_work = async (artist_id: string) => request({
    method: "GET",
    url: "/artist_work?artist_id="+artist_id
})

export const get_artist_single_work = async (id: string) => request({
    method: "GET",
    url: `/artist_work/${id}`
})

export const create_artist_work = async (data: CreatePortfolio) => request({
    method: "POST",
    url: "/artist_work",
    data: data
})

export const delete_artist_work = async (id: string) => request({
    method: "DELETE",
    url: `/artist_work/${id}`
})


export const update_artist_work = async (data: Portfolio, id: string) => request({
    method: "PATCH",
    url: `/artist_work/${id}`,
    data: data
})
