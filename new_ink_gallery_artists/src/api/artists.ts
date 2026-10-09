import request from "../utils/network"
import { Artist, CreateArtist } from "../types/Artist"

export const get_artists = async () => request({
    method: "GET",
    url: "/artists"
})

export const get_artist = async (id: string) => request({
    method: "GET",
    url: `/artists/${id}`
})

export const create_artist = async (data: CreateArtist) => request({
    method: "POST",
    url: "/artists",
    data: data
})

export const delete_artist = async (id: string) => request({
    method: "DELETE",
    url: `/artists/${id}`
})


export const update_artist = async (data: Artist, id: string) => request({
    method: "PATCH",
    url: `/artists/${id}`,
    data: data
})
