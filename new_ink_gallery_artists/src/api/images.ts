import request from "../utils/network"
// import { Image } from "../types/Image"

type ImageDelete = {
    images: string[]
}


export const upload_images = async (data: any, id: string) => request({
    method: "POST",
    url: `/image_uploads?id=${id}`,
    data: data
})

export const delete_images = async (data: ImageDelete) => request({
    method: "POST",
    url: `/image_uploads/delete`,
    data: data
})
