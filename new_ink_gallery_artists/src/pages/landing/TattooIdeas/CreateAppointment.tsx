import { useForm } from "react-hook-form";
import { useState } from "react";
import Popup from "../../../layouts/components/Common/Popup";
import NewDateAppointments from "../Designs/components/NewDateSelection";
import { BiCheck } from "react-icons/bi";
import { get_artists } from "../../../api/artists";
import { useApiGet, useApiSend } from "../../../context/hooks/query";
import { create_appointment_request } from "../../../api/appointment_requests";
import { CreateAppointmentRequest } from "../../../types/AppointmentRequest";
import { usePopup } from "../../../context/hooks/usePopUp";
import { toast } from "react-toastify";
import { TattooIdea } from "../../../types/TattooIdea";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  images: string[];
  idea: string;
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


export default function CreateIdeaAppointment() {
  const {handleHidePopup, hidePopup} = usePopup()
  const selected_idea = hidePopup.data
  const [selectedArtist, setSelectedArtist] = useState(undefined)
  const [contactMethod, setContactMethod] = useState("email")

  const [proposedDates, setProposedDates] = useState<AppointmentSlot[]>([
    { date: null, time: "" },
    { date: null, time: "" },
    { date: null, time: "" }
  ]);

  const contact_methods = ["email", "text"]

  console.log(hidePopup)

  const {
    data: artists,
  } = useApiGet(["artists"], get_artists);


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

  const onSubmit = (data: FormData) => {
    const resData: CreateAppointmentRequest = {
      customer_info: {email: data.email, first_name: data.firstName, last_name: data.lastName, phone: data.phone, contact_method: contactMethod},
      idea: selected_idea.id,
      images: [selected_idea.image],
      artist: selectedArtist,
      length: selected_idea.precise_length || 60,
      first_date: formattedDates[0],
      second_date: formattedDates[1],
      third_date: formattedDates[2],
      service: 27244
    }


    if(data.placement) {resData.placement=data.placement}

    if (data.notes) {resData.notes=data.notes}
    if (!resData.first_date || !resData.second_date || !resData.third_date){
      alert("Ensure you have selected the dates")
      return
    }


    mutate(resData, {
        onSuccess: () => {
            toast.success("We have received your request. Our Booking assistant will contact you shortly!")
            reset()
            handleHidePopup({show: false, type: "create"})
          },
        onError: () => {
            toast.error("There was a problem sending your request. Our team is looking into it. Try again later!")
            reset()
            handleHidePopup({show: false, type: "create"})
          },
      })
  };

  return selected_idea && (
    <Popup max_w="sm:max-w-[500px] lg:max-w-[1000px]">
      <div className="flex flex-col lg:flex-row lg:h-[80vh] w-full">
        {/* Images */}
        <div className="lg:w-1/2 flex flex-col lg:items-center lg:sticky lg:top-0 lg:h-[80vh] lg:overflow-y-auto lg:mb-0 mt-4">
          <div className="w-full flex justify-center">
            <img
              width={400}
              src={selected_idea.image}
              alt={selected_idea.name}
              className="object-contain max-h-[50vh]"
            />
          </div>
        </div>

        {/* Content */}
        <div className="lg:w-1/2 px-4 sm:pr-6 pb-4 lg:overflow-y-auto scrollbar-hide">
          <h3 className="font-semibold text-3xl uppercase mb-2">{selected_idea.name}</h3>
          <p>{selected_idea.description}</p>



          <h3 className="font-semibold text-2xl lg:mt-0 mt-4">Request Appointment</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
            {/* Artist */}
            <div>
              <div className="rounded border px-2 mb-2 py-1 border-black shadow text-center w-[7rem] text-sm font-semibold">
                <h3 className="">Choose Artist</h3>
              </div>
              <div className="my-2">
                <select
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedArtist(value === "any" ? null : value);
                }}
                  // {...register("artist")}
                  className="border shadow px-4 py-2 rounded w-full bg-transparent outline-none max-h-[5rem]"
                >
                  <option onClick={()=>setSelectedArtist(undefined)} value={undefined}>Any available artist</option>
                  {artists && artists.map(artist => (
                    <option onClick={()=>setSelectedArtist(artist.id)} value={artist.id} key={artist.id}>{artist.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Personal Info */}
            <div className="rounded border px-2 -mb-2 py-1 border-black shadow text-center w-[7rem] text-sm font-semibold">
              <h3>Contact Info</h3>
            </div>

            <div className="flex gap-2 -mb-2">
              <input
                type="text"
                required
                placeholder="First Name"
                className="border shadow px-4 py-2 rounded bg-transparent outline-none w-full"
                {...register("firstName", { required: "First name is required" })}
              />
              <input
                type="text"
                required
                placeholder="Last Name"
                className="border shadow px-4 py-2 rounded bg-transparent outline-none w-full"
                {...register("lastName", { required: "Last name is required" })}
              />
            </div>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                required
                className="border shadow px-4 py-2 rounded bg-transparent outline-none w-full"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              <input
                type="tel"
                required
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
                placeholder="Placement (Ex Lower Back)"
                className="mt-2 border shadow px-4 py-2 rounded bg-transparent outline-none"
                {...register("placement")}
              />
              <textarea
                rows={3}
                placeholder="Notes"
                className="mt-2 border shadow px-4 py-2 rounded bg-transparent outline-none w-full hidden"
                {...register("notes", { maxLength: 500 })}
              />
            </div>

            {/* Dates */}
            <NewDateAppointments
              artist={selectedArtist}
              onDatesChange={setProposedDates}
            />

            {/* Submit */}
            <button disabled={isPending} type="submit" className="border shadow px-4 py-2 rounded text-center bg-black text-white mt-2">
              <div className={`${(isPending) && "animate-pulse"}`}>Send Request</div>
            </button>
          </form>
        </div>
      </div>
    </Popup>
  )
}
