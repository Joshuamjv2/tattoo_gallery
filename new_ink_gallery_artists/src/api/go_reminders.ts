import request from "../utils/network"

export const get_go_reminders_artists = async () => request({
    method: "GET",
    url: "/goreminders/go_reminders_artists"
})

export const get_go_reminders_artist_appointments = async (id: string) => request({
    method: "GET",
    url: "/goreminders/go_reminders_artist_appointments?artist_id="+id
})

export const get_go_reminders_services = async () => request({
    method: "GET",
    url: "/goreminders/go_reminders_services"
})