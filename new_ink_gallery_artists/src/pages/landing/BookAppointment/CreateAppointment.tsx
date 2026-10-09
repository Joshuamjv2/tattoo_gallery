import { useForm } from "react-hook-form";
import { useState } from "react";
import NewDateAppointments from "../Designs/components/NewDateSelection";
import { get_go_reminders_services } from "../../../api/go_reminders";
import { get_artists } from "../../../api/artists";
import { create_appointment_request } from "../../../api/appointment_requests";
import { usePopup } from "../../../context/hooks/usePopUp";
import { useApiSend, useApiGet } from "../../../utils/hooks/query";
import { toast } from "react-toastify";
import MultiImageUpload from "../../admin/components/Commons/ImageUploads";
import LoadingModal from "../../../components/common/Loading";
import { CreateAppointmentRequest } from "../../../types/AppointmentRequest";
import { upload_images } from "../../../api/images";
import Popup from "../../../layouts/components/Common/Popup";

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    images: string[];
    placement?: string;
    notes?: string;
    artist?: string;
    first_date: string;
    second_date: string;
    third_date: string;
};

type AppointmentSlot = {
    date: Date | null;
    time: string;
};


export default function CreateGeneralAppointment() {
  const [selectedArtist, setSelectedArtist] = useState(undefined)
  const [selectedService, setSelectedService] = useState(27244)
  const [contactMethod, setContactMethod] = useState("email")
  const [images, setImages] = useState<File[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false)
  const {handleHidePopup} = usePopup()


  const [proposedDates, setProposedDates] = useState<AppointmentSlot[]>([
    { date: null, time: "" },
    { date: null, time: "" },
    { date: null, time: "" }
  ]);

  const reset_all = () => {
    setUploadingImage(false)
    setSelectedArtist(undefined)
    setSelectedService(undefined)
    setImages([])
    setProposedDates([
      { date: null, time: "" },
      { date: null, time: "" },
      { date: null, time: "" }
    ])
    setContactMethod("email")
    reset()
    handleHidePopup({show: false, type: "create"})
  }

  const contact_methods = ["email", "text"]

  
  const handleImagesSelected = (selectedImages: File[]) => {
        setImages(prevImages => [...prevImages, ...selectedImages]);
    };

  const handleOldImageRemoved = (url: string) => {
      setRemovedInitialImages(prev => [...prev, url]);
  };

  const {
    data: artists,
    // isFetched: artists_fetched,
    isLoading: artists_loading
  } = useApiGet(["artists"], get_artists);

  // const {
  //   data: go_reminders_services,
  //   // isFetched: services_fetched,
  //   isLoading: loading_services
  // } = useApiGet(["services"], get_go_reminders_services)


  const formatDateTime = (date: Date, time: string): Date => {
    const [timeStr, modifier] = time.split(" ");
    let [hour, minute] = timeStr.split(":").map(Number);
    if (modifier === "PM" && hour !== 12) hour += 12;
    if (modifier === "AM" && hour === 12) hour = 0;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute);
  };

    const { mutate, isPending } = useApiSend(create_appointment_request, undefined, undefined, ["appointment_requests"]);

  const formattedDates = proposedDates.map((slot) =>
    slot.date && slot.time ? formatDateTime(slot.date, slot.time) : null
  );


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();


  const onSubmit = async (data: FormData) => {
    const resData: CreateAppointmentRequest = {
      customer_info: {email: data.email, first_name: data.firstName, last_name: data.lastName, phone: data.phone, contact_method: contactMethod},
      images: [],
      artist: selectedArtist,
      length: 60,
      service: selectedService,
      first_date: formattedDates[0],
      second_date: formattedDates[1],
      third_date: formattedDates[2]
    }


    if(data.placement) {resData.placement=data.placement}

    if (data.notes) {resData.notes=data.notes}
    if (!resData.first_date || !resData.second_date || !resData.third_date){
      alert("Ensure you have selected the dates")
      return
    }


    mutate(resData, {
        onSuccess: async (createdRequest: CreateAppointmentRequest) => {

          if (images.length < 1){
              reset_all()
              toast.success("We have received your request. Our Booking assistant will contact you shortly!")
              return
          }

          const formData = new FormData()
              images.forEach((image) => {
                formData.append('images', image);
              });
              formData.append('entity', "appointment_request");
              setUploadingImage(true)
              await upload_images(formData, createdRequest.id).then(()=>{
                reset_all()
                // handleHidePopup({show: false, type: "create"})
                toast.success("We have received your request. Our Booking assistant will contact you shortly!")
              })
          },
        onError: () => {
            reset_all()
            toast.error("There was a problem sending your request. Our team is looking into it. Try again later!")
          },
      })
  };

  return (
    <Popup title="Request appointment" max_w="max-w-[600px]">
      <div className="w-full">
        {/* Images */}

        {/* Content */}
        <div className="mx-auto z-50">


          {/* <h3 className="font-semibold text-2xl mt-4">Request Appointment</h3> */}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
            {/* Artist */}
            <div className="flex flex-col sm:flex-row items-center w-full justify-between gap-2">
            <div className="w-full">
              <div className="rounded border px-2 mb-2 py-1 border-black shadow text-center w-[7rem] text-sm font-semibold">
                <h3 className="">Choose Artist</h3>
              </div>
              <div className="my-2">
                <select
                disabled={uploadingImage || isPending}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedArtist(value === "any" ? null : value);
                }}
                  // {...register("artist")}
                  className="border shadow px-4 py-2 rounded w-full bg-transparent outline-none"
                >
                  <option onClick={()=>setSelectedArtist(undefined)} value={undefined}>Any available artist</option>
                  {artists && artists.map(artist => (
                    <option onClick={()=>setSelectedArtist(artist.id)} value={artist.id} key={artist.id}>{artist.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Service */}
            {/* <div className="w-full mt-2 sm:mt-0">
              <div className="rounded border px-2 mb-2 py-1 border-black shadow text-center w-[8rem] text-sm font-semibold">
                <h3 className="">Choose Service</h3>
              </div>
              <div className="my-2">
                <select
                disabled={uploadingImage || isPending}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedService(value === "any" ? null : value);
                }}
                  // {...register("artist")}
                  className="border shadow px-4 py-2 rounded w-full bg-transparent outline-none"
                >
                  <option value={""} className="font-semibold">Choose Service</option>
                  {go_reminders_services && go_reminders_services.map(service => (
                    <option onClick={()=>setSelectedService(service.id)} value={service.id} key={service.id}>{service.label}</option>
                  ))}
                </select>
              </div>
            </div> */}
            </div>

            {/* Personal Info */}
            <div className="rounded border px-2 -mb-2 py-1 border-black shadow text-center w-[7rem] text-sm font-semibold">
              <h3>Contact Info</h3>
            </div>

            <div className="flex gap-2 -mb-2">
              <input
                type="text"
                required
                disabled={uploadingImage || isPending}
                placeholder="First Name"
                className="border shadow px-4 py-2 rounded bg-transparent outline-none w-full"
                {...register("firstName", { required: "First name is required" })}
              />
              <input
                type="text"
                required
                disabled={uploadingImage || isPending}
                placeholder="Last Name"
                className="border shadow px-4 py-2 rounded bg-transparent outline-none w-full"
                {...register("lastName", { required: "Last name is required" })}
              />
            </div>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                disabled={uploadingImage || isPending}
                required
                className="border shadow px-4 py-2 rounded bg-transparent outline-none w-full"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              <input
                type="tel"
                required
                disabled={uploadingImage || isPending}
                placeholder="Phone number"
                className="border shadow px-4 py-2 rounded bg-transparent outline-none w-full"
                {...register("phone", {
                  required: "Phone number is required"
                })}
              />
            </div>

            {/* Contact method */}
            <div className="border py-1 px-2 rounded border-black shadow w-[8rem] text-center text-sm font-semibold mt-2">Contact Method</div>
            <div className="-mt-2 flex justify-between border rounded">
                {contact_methods.map(method => <div key={method} onClick={()=>setContactMethod(method)} className={`${method === contactMethod && "bg-black text-white rounded"} w-full border-r last:border-r-0 cursor-pointer py-2`}>
                    <p className="text-center capitalize">{method}</p>
                  </div>)}
            </div>

            {/* More Info */}
            <div className="flex flex-col">
              <div className="flex gap-2 mt-2">
                <label className="border py-1 px-2 rounded border-black shadow w-[6rem] text-center text-sm font-semibold">
                  More Info
                </label>
                <p className="text-black/40">(Optional)</p>
              </div>
              <input
                type="text"
                disabled={uploadingImage || isPending}
                placeholder="Placement (Ex Lower Back)"
                className="mt-2 border shadow px-4 py-2 rounded bg-transparent outline-none"
                {...register("placement")}
              />
              <textarea
                rows={3}
                disabled={uploadingImage || isPending}
                placeholder="Notes"
                className="mt-2 border shadow px-4 py-2 rounded bg-transparent outline-none w-full"
                {...register("notes", { maxLength: 500, minLength: 50 })}
              />
            </div>

            {/* images */}
            <MultiImageUpload
              maxFiles={4}
              onImagesSelected={handleImagesSelected}
              onOldImageRemoved={handleOldImageRemoved}
              />

            {/* Dates */}
            <NewDateAppointments
              artist={selectedArtist}
              onDatesChange={setProposedDates}
            />

            {/* Submit */}
            <button disabled={isPending || uploadingImage} type="submit" className="border shadow px-4 py-2 rounded text-center bg-black text-white mt-2">
              <div className={`${(isPending || uploadingImage) && "animate-pulse"}`}>{isPending || uploadingImage ? "Sending...": "Send Request"}</div>
            </button>
          </form>
        </div>
      </div>
      </Popup>
  )
}
