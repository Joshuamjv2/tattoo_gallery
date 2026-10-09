import request from "../utils/network"
import { Portfolio, CreatePortfolio } from "../types/Portfolio"

export const get_appointment_request = async (id: string) => request({
    method: "GET",
    url: "/appointment_requests/"+id
})

export const get_appointment_requests = async () => request({
    method: "GET",
    url: `/appointment_requests`
})

export const create_appointment_request = async (data) => request({
    method: "POST",
    url: "/appointment_requests",
    data: data
})

export const delete_appointment_request = async (id: string) => request({
    method: "DELETE",
    url: `/appointment_requests/`+id
})


export const approve_appointment_request = async (data, id: string) => request({
    method: "POST",
    url: `/appointment_requests/${id}`,
    data: data
})


export const update_appointment_request = async (data, id: string) => request({
    method: "PATCH",
    url: `/appointment_requests/${id}`,
    data: data
})
