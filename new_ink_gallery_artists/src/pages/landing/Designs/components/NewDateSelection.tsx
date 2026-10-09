import { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Appointment as TypeAppointment } from "../../../../types/Appointment";
import { useApiGet } from "../../../../context/hooks/query";
import { get_go_reminders_artist_appointments } from "../../../../api/go_reminders";
import "../../../../CustomeDatePickerWidth.css"

type AppointmentSlot = {
  date: Date | null;
  time: string;
};

interface Props {
  artist?: string;
  duration?: Int16Array;
  onDatesChange?: (dates: AppointmentSlot[]) => void;
}


export default function NewDateAppointments({ onDatesChange, artist = "9087612" }: Props) {
  const [appointmentDates, setAppointmentDates] = useState<AppointmentSlot[]>([
    { date: null, time: "" },
    { date: null, time: "" },
    { date: null, time: "" }
  ]);

  console.log(artist, "This is the artist I wanna call")
    const {
        data: artist_appointments,
    } = useApiGet(["artist_appointments", artist], ()=>get_go_reminders_artist_appointments(artist ? artist: ""));

    const artistAppointments = useMemo(() => {
        if (!artist || !artist_appointments) return [];
        return artist_appointments.map((appt) => {
          const [dateStr, timeStr] = appt.date.split(" ");
          const [month, day, year] = dateStr.split("/").map(Number);
          const [hour, minute] = timeStr.split(":").map(Number);
          return {
            start: new Date(year, month - 1, day, hour, minute),
            end: new Date(new Date(year, month - 1, day, hour, minute).getTime() + appt.length * 60000)
          };
        });
      }, [artist, artist_appointments]);

  const timeSlots = [
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
    "6:00 PM", "6:30 PM", "7:00 PM"
  ];

  const parseTime = (date: Date, timeStr: string): Date => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
  };

  const isSlotAlreadyChosen = (date: Date, time: string, index: number) => {
    const currentDateTime = parseTime(date, time).getTime();
    return appointmentDates.some((slot, i) => 
      i !== index && 
      slot.date && 
      parseTime(slot.date, slot.time).getTime() === currentDateTime
    );
  };

  const isTimeAvailable = (selectedDate: Date, timeStr: string): boolean => {
    const proposedStart = parseTime(selectedDate, timeStr);
    const proposedEnd = new Date(proposedStart.getTime() + 30 * 60000);
    return !artistAppointments.some(({ start, end }) => {
      return proposedStart < end && proposedEnd > start;
    });
  };

  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 0; // Exclude Sundays
  };

  const handleDateChange = (date: Date | null, index: number) => {
    const newDates = [...appointmentDates];
    newDates[index].date = date;
    newDates[index].time = "";
    setAppointmentDates(newDates);
    onDatesChange?.(newDates);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const newDates = [...appointmentDates];
    newDates[index].time = e.target.value;
    setAppointmentDates(newDates);
    onDatesChange?.(newDates);
  };

  return (
    <div className="mt-2">
      <div className="rounded border px-2 py-1 border-black shadow text-center w-[12rem] mb-1 text-sm font-semibold">
        <h3>Propose three dates</h3>
      </div>
      <div className="space-y-1">
        {appointmentDates.map((slot, index) => {
          const isFirst = index === 0;
          const previousComplete = isFirst || (appointmentDates[index - 1].date && appointmentDates[index - 1].time);
          const disableDate = !previousComplete;
          const disableTime = !slot.date || !previousComplete;

          return (
            <div key={index} className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-[0.25rem]">Date</label>
                <div className="w-full">
                <DatePicker
                  selected={slot.date}
                  onChange={(date) => handleDateChange(date, index)}
                  filterDate={isWeekday}
                  minDate={new Date()}
                  wrapperClassName="w-full"
                  className={`w-full shadow outline-none px-4 py-2 rounded ${disableDate ? "bg-black/10":"bg-white"}`}
                  placeholderText="Select a date"
                  dateFormat="MMMM d, yyyy"
                  disabled={disableDate}
                />
                </div>
                {disableDate && (
                  <p className="text-xs text-gray-400 mt-1 hidden">
                    Please complete the previous slot first.
                  </p>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium mb-[0.25rem]">Time</label>
                <select
                  className={`w-full border shadow px-4 outline-none py-2 rounded ${disableTime ? "bg-black/10" :"bg-white"}`}
                  value={slot.time}
                  onChange={(e) => handleTimeChange(e, index)}
                  disabled={disableTime}
                >
                  <option value="">
                    {!previousComplete
                      ? "Complete previous"
                      : slot.date
                      ? "Select time"
                      : "Select date first"}
                  </option>
                  {timeSlots.map((time) => (
                    <option
                      key={time}
                      value={time}
                      disabled={slot.date ? !isTimeAvailable(slot.date, time) || isSlotAlreadyChosen(slot.date, time, index)  : false}
                    >
                      {time}
                    </option>
                  ))}
                </select>
                {disableTime && (
                  <p className="text-xs text-gray-400 mt-1 hidden">
                    {slot.date
                      ? "Please complete the previous slot first."
                      : "Select a date first."}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-gray-500 mt-2">
        Available Monday–Saturday, 12PM–7PM. <span className="font-semibold text-black">You will be contacted to approve your appointment.</span>
      </p>
    </div>
  );
}
