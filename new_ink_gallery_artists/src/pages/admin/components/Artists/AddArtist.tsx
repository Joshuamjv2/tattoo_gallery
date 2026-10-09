import Popup from "../../../../layouts/components/Common/Popup"
import MultiImageUpload from "../Commons/ImageUploads"
import { usePopup } from "../../../../context/hooks/usePopUp"
import { useForm } from "react-hook-form"
import { create_artist, update_artist } from "../../../../api/artists"
import { Artist, CreateArtist } from "../../../../types/Artist"
import { useState } from "react"
import { toast } from "react-toastify"
import { useQueryClient } from "@tanstack/react-query"
import { upload_images, delete_images } from "../../../../api/images"
import { useApiSend, useApiGet } from "../../../../context/hooks/query"
import { get_go_reminders_artists } from "../../../../api/go_reminders"

export default function AddArtist() {
    const { hidePopup, handleHidePopup } = usePopup()
    const [uploadingImage, setUploadingImage] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [removedInitialImages, setRemovedInitialImages] = useState<string[]>([])
    const queryClient = useQueryClient()

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateArtist>({
        defaultValues: {
            name: hidePopup.data?.name || "",
            email: hidePopup.data?.email || "",
            instagram: hidePopup.data?.instagram || "",
            description: hidePopup.data?.description || "",
            go_reminders_id: hidePopup.data?.go_reminders_id ?? undefined,
        },
    })

    const operation = hidePopup.type === "create"
        ? create_artist
        : (data: CreateArtist) => update_artist(data, hidePopup.data.id)

    const handleImagesSelected = (files: File[]) => {
        if (files.length > 0) {
            setSelectedImage(files[0])
        }
    }

    const handleOldImageRemoved = (url: string) => {
        setRemovedInitialImages(prev => [...prev, url])
    }

    const { mutate: createArtist, isPending: isCreating } = useApiSend(operation, undefined, undefined, ["artists"])

    const {
        data: go_reminders_artists = [],
        isLoading,
        isFetching,
        isFetched,
    } = useApiGet(["go_reminders_artists"], get_go_reminders_artists)

    const onSubmit = async (data: CreateArtist) => {
        const artistData: Artist = {
            ...data,
        }

        if (hidePopup.type === "edit") {
            const change_artist = (artist: Artist) => {
                createArtist(artist, {
                    onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ["artists" , "artist", hidePopup.data.id] }).then(() => {
                            handleHidePopup({ show: false, type: "create" })
                            setUploadingImage(false)
                            reset()
                        })
                    }
                })
            }

            setUploadingImage(true)
            if (removedInitialImages.length > 0) {
                await delete_images({ images: removedInitialImages })
                if (selectedImage) {
                    const formData = new FormData()
                    formData.append("images", selectedImage)
                    formData.append('entity', "artist")
                    await upload_images(formData, hidePopup.data.id)
                } else {
                    artistData.image = undefined
                }
                change_artist(artistData)
            } else {
                change_artist(artistData)
            }

            await queryClient.invalidateQueries({ queryKey: ["artists", "artist", hidePopup.data.id] })
            return
        }

        createArtist(artistData, {
            onSuccess: async (createdArtist: Artist) => {
                if (!selectedImage || hidePopup.type === "edit") {
                    handleHidePopup({ show: false, type: "create" })
                    reset({
                        name: "",
                        instagram: "",
                        description: "",
                        go_reminders_id: undefined,
                    })
                    return
                }

                const formData = new FormData()
                formData.append("images", selectedImage)
                formData.append('entity', "artist")
                setUploadingImage(true)

                await upload_images(formData, createdArtist.id)
                queryClient.invalidateQueries({ queryKey: ["artists"] }).then(() => {
                    setUploadingImage(false)
                    handleHidePopup({ show: false, type: "create" })
                    reset()
                })
            },
            onError: (error) => {
                toast.error("Error creating artist")
                console.log(error)
                handleHidePopup({ show: false, type: "create" })
            },
        })
    }

    return (
        <Popup title={hidePopup.type === "create" ? "Add New Artist" : "Edit Artist Details"} max_w="sm:max-w-[500px]">
            <MultiImageUpload
                onImagesSelected={handleImagesSelected}
                onOldImageRemoved={handleOldImageRemoved}
                initial_images={hidePopup.data?.image ? [hidePopup.data.image] : []}
                maxFiles={1}
            />

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                <div className="lg:flex justify-between items-center w-full lg:mt-4 gap-4">
                    <div className="flex flex-col lg:w-1/2">
                        <div className="mt-2 border shadow px-4 py-2 rounded">
                            <input
                                type="text"
                                className="bg-transparent outline-none w-full"
                                placeholder="Name"
                                disabled={isCreating || uploadingImage}
                                {...register("name", { required: "Name is required" })}
                            />
                        </div>
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    <div className="flex flex-col lg:w-1/2">
                        <div className="mt-2 border shadow px-4 py-2 rounded">
                            <input
                                type="email"
                                className="bg-transparent outline-none w-full"
                                placeholder="Email"
                                disabled={isCreating || uploadingImage}
                                {...register("email", { required: "Email is required" })}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    <div className="flex flex-col mt-4 lg:mt-0 lg:w-1/2">
                        <div className="mt-2 border shadow px-4 py-2 rounded">
                            <input
                                type="text"
                                className="bg-transparent outline-none w-full"
                                placeholder="Instagram"
                                disabled={isCreating || uploadingImage || isLoading}
                                {...register("instagram")}
                            />
                        </div>
                    </div>
                </div>

                {isFetched && (
                    <div className="w-full py-2">
                        <div className="mt-2 border shadow px-4 py-2 rounded">
                            <select
                                id="go-reminders-profile"
                                className="bg-transparent outline-none w-full"
                                disabled={isCreating || uploadingImage || isLoading || isFetching}
                                {...register("go_reminders_id", {
                                    setValueAs: (v) => v === "" ? undefined : Number(v),
                                })}
                            >
                                <option className="text-black/50" value={undefined} disabled>
                                    Go reminders profile
                                </option>
                                {hidePopup.type === "edit" && hidePopup.data?.go_reminders_id && (
                                    <option value={hidePopup.data.go_reminders_id}>
                                        {go_reminders_artists.find(artist => artist.id === hidePopup.data.go_reminders_id)?.name || "Previously selected"}
                                    </option>
                                )}
                                {go_reminders_artists
                                    .filter(artist => artist.id !== hidePopup.data?.go_reminders_id)
                                    .map((artist) => (
                                        <option key={artist.id} value={artist.id}>
                                            {artist.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                )}

                <div className="flex flex-col mt-2">
                    <div className="mt-2 border shadow px-4 py-2 rounded">
                        <textarea
                            className="bg-transparent outline-none w-full"
                            placeholder="Description"
                            minLength={50}
                            disabled={isCreating || uploadingImage || isLoading}
                            rows={4}
                            {...register("description")}
                        />
                    </div>
                </div>

                <div className={`flex justify-end`}>
                    <button
                        disabled={isCreating || isLoading || uploadingImage}
                        type="submit"
                        className="outline-none my-4 rounded bg-black text-white py-1 px-2 max-w-[8rem] text-center"
                    >
                        {isCreating || uploadingImage
                            ? 'Saving...'
                            : hidePopup.type === "create"
                                ? "Add Artist"
                                : "Save"}
                    </button>
                </div>
            </form>
        </Popup>
    )
}
