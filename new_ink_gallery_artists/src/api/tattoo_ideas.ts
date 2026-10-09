import { TattooIdea, CreateTattooIdea } from "../types/TattooIdea";
import request from "../utils/network";

export const get_ideas = async () => request({
    method: "GET",
    url: "/tattoo_ideas"
})

export const get_single_idea = async (id: string) => request({
    method: "GET",
    url: `/tattoo_ideas/${id}`
})

export const create_idea = async (data: CreateTattooIdea) => request({
    method: "POST",
    url: "/tattoo_ideas",
    data: data
})

export const delete_idea = async (id: string) => request({
    method: "DELETE",
    url: `/tattoo_ideas/${id}`
})


export const update_idea = async (data: TattooIdea, id: string) => request({
    method: "PATCH",
    url: `/tattoo_ideas/${id}`,
    data: data
})
