import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AppointmentSlot } from "@/types/Appointment";

interface Props {
  initialDate?: AppointmentSlot;
  onChange: (slot: AppointmentSlot) => void;
}

const timeSlots = [
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM"
];

export default function SingleDateAppointmentSelector({ initialDate, onChange }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate?.date ? new Date(initialDate.date) : null
  );

  const [selectedTime, setSelectedTime] = useState<string>(() => {
    if (!initialDate?.date) return "";
    const date = new Date(initialDate.date);
    const formatted = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); // e.g. "1:30 PM"
    return timeSlots.includes(formatted) ? formatted : "";
  });

  useEffect(() => {
    if (selectedDate && selectedTime) {
      // Convert selectedTime ("1:30 PM") into hours and minutes
      const [time, modifier] = selectedTime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
  
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
  
      const fullDate = new Date(selectedDate);
      fullDate.setHours(hours, minutes, 0, 0); // set to exact time
  
      onChange({ date: fullDate, time: selectedTime });
    }
  }, [selectedDate, selectedTime]);

  return (
    <div className="flex gap-2">
      <div className="bg-transparent w-full">
        <label className="block mb-2 text-sm font-medium text-black/50">Date</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setSelectedTime(""); // reset time when date changes
          }}
          minDate={new Date()}
          dateFormat="PPP"
          placeholderText="Select a date"
          className="w-full px-3 py-1 bg-transparent rounded-md border outline-none"
        />
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium text-black/50 mb-2">Time</label>
        <select
          className="outline-none w-full px-3 py-1 border rounded-md bg-transparent"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          disabled={!selectedDate}
        >
          <option value="">
            {!selectedDate ? "Select date first" : "Select a time"}
          </option>
          {timeSlots.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
