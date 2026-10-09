import LandingLayout from "../../../layouts/LandingLayOut"
import CreateAppointment from "./CreateAppointment"

export default function BookAppointment(){
    return <div>
        <LandingLayout>
            <div className="px-4 mb-8">
                <h1 className="font-bold text-left sm:text-center text-lg sm:text-3xl md:text-4xl mt-2 mb-4 md:mb-6 md:mt-4">Book Appointment</h1>
                <div className="">
                    <CreateAppointment />
                </div>
            </div>
        </LandingLayout>
    </div>
}