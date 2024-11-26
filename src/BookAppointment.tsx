import React, {useState, useEffect, useRef, ChangeEvent} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faShieldDog } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { User, PetProfile, fetchAppointments, Appointment, addAppointment } from './utils/supabase'

interface BookAppointmentProps {
  user: User;
  fetching?: boolean;
}

function BookAppointment({user, fetching}: BookAppointmentProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPet, setSelectedPet] = useState<PetProfile>();
  const [selectedService, setSelectedService] = useState<string>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedDate, setSelectedDate] = useState<string>();
  const selectPet = (pet: PetProfile) => setSelectedPet(pet);
  const selectService = (service: string) => setSelectedService(service);
  const selectTime = (time: string) => setSelectedTime(time);
  const selectDate = (date: string) => setSelectedDate(date);
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const previousStep = () => setCurrentStep((prev) => prev - 1);

  if (fetching) {
    return (
      <div className="BookAppointment">
        <h2>Book Appointment</h2>
        <p>Book an appointment for your pet.</p>
        <div className="booking">
          <div className="loading-circle"></div>
        </div>
      </div>
    )
  }
  return (
    <div className="BookAppointment">
      <h2>Book Appointment</h2>
      <p>Book an appointment for your pet.</p>
      <div className="booking">
        {currentStep === 1 && <SelectPet nextStep={nextStep} selectPet={selectPet} pets={user.petProfiles} currentValue={selectedPet} />}
        {currentStep === 2 && <SelectService nextStep={nextStep} selectService={selectService} previousStep={previousStep} currentValue={selectedService || ''} />}
        {currentStep === 3 && <SelectTime nextStep={nextStep} selectDate={selectDate} selectTime={selectTime} previousStep={previousStep} selectedService={selectedService || ''} currentDate={selectedDate || ''} currentTime={selectedTime || ''} />}
        {currentStep === 4 && selectedPet && selectedService && selectedTime && selectedDate && user && <AppointmentSummary user={user} pet={selectedPet} service={selectedService} time={selectedTime} date={selectedDate} previousStep={previousStep} />}
      </div>
    </div>
  );
}
const SelectPet: React.FC<{ nextStep: () => void, pets: Array<PetProfile>, selectPet: (pet: PetProfile) => void, currentValue: PetProfile | undefined }> = ({ nextStep, pets, selectPet, currentValue }) => {
  const [selectedPet, setSelectedPet] = useState(currentValue);
  const handlePetSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    pets.forEach((pet) => {
      if (pet.id.toString() === event.target.value) {
        selectPet(pet);
        setSelectedPet(pet);
      }
    });
  }
  return (
    <div className="form">
      <h2>Select a Pet</h2>
      <p>Select a pet to book an appointment for.</p>
      { pets.length > 0
        ?
        <div className="select-pet">
          <select value={selectedPet?.id || ''} onChange={handlePetSelect}>
            <option value="" disabled>
              Select a Pet
            </option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
          <button id="nextbtn" disabled={selectedPet === undefined} onClick={nextStep}>Next</button>          
        </div>
        :
        <div className="no-pets">
          <FontAwesomeIcon icon={faShieldDog} size="4x" />
          <h4>Appointment Error</h4>
          <p>You currently have no pets. Please create one now to continue.</p>
          <Link to={'/mypets'}>Add Pet</Link>
        </div>
      }
    </div>
  );
};

const SelectService: React.FC<{ nextStep: () => void, previousStep: () => void, selectService: (service: string) => void, currentValue: string }> = ({ nextStep, previousStep, selectService, currentValue }) => {
  const [selectedService, setSelectedService] = useState(currentValue);
  const handleServiceSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    selectService(event.target.value);
    setSelectedService(event.target.value);
  }
  return (
    <div className="form">
      <FontAwesomeIcon id="backbtn" icon={faArrowLeft} onClick={previousStep} />
      <h2>Select a Service</h2>
      <p>Select a service to book an appointment for.</p>
      <div className="service-selection">
        <select value={selectedService} onChange={handleServiceSelect}>
          <option value="" disabled>
            Select a Service
          </option>
          <option value={'Vaccination (30 Minutes)'}>Vaccination (30 Minutes)</option>
          <option value={'Wellness Exam (1 Hour)'}>Wellness Exam (1 Hour)</option>
          <option value={'Boarding (1 Hour)'}>Boarding (1 Hour)</option>
          <option value={'Grooming (2 Hours)'}>Grooming (1-2 Hours)</option>
        </select>
        <p className="dropdown-subtitle">One service per appointment. To book multiple services,<br></br> you'll need to create another appointment.</p>
        <button id="nextbtn" disabled={selectedService === ''} onClick={nextStep}> Next</button>          
      </div>
    </div>
  );
}

export const SelectTime: React.FC<{ nextStep: () => void, previousStep: () => void, selectTime: (time: string) => void, selectDate: (date: string) => void, selectedService: string, currentDate: string, currentTime: string}> = ({ nextStep, previousStep, selectTime, selectDate, selectedService, currentDate, currentTime}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetchAppointments({}).then((appointments) => {
      setAllAppointments(appointments);
    });
  }, []);



  const formatTime = (hours: number, minutes: number) => {
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };


  const generateTimeSlots = () => { 
    if (!selectedDate) {
      return []; // No date selected, no time slots to generate
    }
  
    // Extract duration from selectedService
    const durationMatch = selectedService.match(/\((\d+)\s*(Hour|Minutes)\)/i); // Regex to match the duration
    let duration = 30; // Default to 30 minutes if no match
    if (durationMatch) {
      const value = parseInt(durationMatch[1], 10); // Extract numeric value
      const unit = durationMatch[2].toLowerCase(); // Extract unit (hour/minutes)
      duration = unit === "hour" ? value * 60 : value; // Convert to minutes if in hours
    }
  
    const slots: string[] = [];
    const dateAppointments = allAppointments.filter(
      (appointment) => appointment.scheduled_date.split(" ")[0] === selectedDate
    );
  
    let currentTime = new Date();
    currentTime.setHours(9, 0, 0, 0); // Start at 9:00 AM
  
    while (currentTime.getHours() < 17) {
      const start = formatTime(
        currentTime.getHours(),
        currentTime.getMinutes()
      );
      currentTime.setMinutes(currentTime.getMinutes() + duration); // Add duration
      if (currentTime.getHours() >= 17 && currentTime.getMinutes() > 0) break; // Stop after 5:00 PM
      const end = formatTime(currentTime.getHours(), currentTime.getMinutes());
      const slotStart = new Date(`${selectedDate} ${start}`).getTime();
      const slotEnd = new Date(`${selectedDate} ${end}`).getTime();
  
      const isSlotAvailable = !dateAppointments.some((appointment) => {
        const appointmentDate = appointment.scheduled_date.split(" ")[0];
        const appointmentTimeRange = appointment.scheduled_date.slice(10);
        if (appointmentDate !== selectedDate) return false; // Skip appointments on different dates
  
        const appointmentStartTime = appointmentTimeRange.split(" - ")[0];
        const appointmentEndTime = appointmentTimeRange.split(" - ")[1];
        const appointmentStart = new Date(`${appointmentDate} ${appointmentStartTime}`).getTime();
        const appointmentEnd = new Date(`${appointmentDate} ${appointmentEndTime}`).getTime();
  
        return (
          (slotStart >= appointmentStart && slotStart < appointmentEnd) || // Slot start overlaps
          (slotEnd > appointmentStart && slotEnd <= appointmentEnd) || // Slot end overlaps
          (slotStart <= appointmentStart && slotEnd >= appointmentEnd) // Slot completely covers appointment
        );
      });
  
      if (isSlotAvailable) {
        slots.push(`${start} - ${end}`);
      }
    }
  
    return slots;
  };
  
  

  const handleSelectTime = (
    time: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    selectTime(time);
    const buttons = document.querySelectorAll(".time-slot-button");
    buttons.forEach((button) => button.classList.remove("selected"));
    (e.target as HTMLElement).classList.add("selected");
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    selectDate(date);
    setAvailableTimes(generateTimeSlots());
    setShowDatePicker(false);
  };

  useEffect(() => {
    if (currentDate) {
      setSelectedDate(currentDate);
      setAvailableTimes(generateTimeSlots());
    }
  }, [currentDate]);

  useEffect(() => {
    if (selectedDate) {
      const availableSlots = generateTimeSlots();
      setAvailableTimes(availableSlots); // Update the available time slots
    }
  }, [selectedDate, allAppointments]);
  

  useEffect(() => {
    if (currentTime && currentDate) {
      const buttons = document.querySelectorAll(".time-slot-button");
      buttons.forEach((button) => {
        if (button.textContent?.includes(currentTime)) {
          button.classList.add("selected");
        }
      });
    }
  }, [currentTime, availableTimes]);

  return (
    <div className="form">
      <FontAwesomeIcon id="backbtn" icon={faArrowLeft} onClick={previousStep} />
      <h2 className="form-title">Select Date and Time</h2>
      <p className="form-subtitle">
        Select a date and time for your appointment.
      </p>

      <div className="date-picker-container">
        <div
          className="date-input"
          onClick={() => setShowDatePicker(!showDatePicker)}
        >
          {selectedDate || "Select a Date"}
        </div>
        {showDatePicker && (
          <div className="date-picker-popup">
            <CustomDatePicker onDateSelect={handleDateSelect} />
          </div>
        )}
      </div>

      {selectedDate && (
        <div className="time-slots">
          <h4 className="time-slots-title">Available Times:</h4>
          <div className="time-slots-container">
            {availableTimes.length > 0 ? (
              availableTimes.map((time) => (
                <button
                  key={time}
                  className={`time-slot-button ${
                    time === currentTime ? "selected" : ""
                  }`}
                  onClick={(e) => handleSelectTime(time, e)}
                >
                  {time}
                </button>
              ))
            ) : (
              <p>No available times for the selected date.</p>
            )}
          </div>
        </div>
      )}

      <button
        id="nextbtn"
        style={{ width: "50%", margin: "auto" }}
        onClick={nextStep}
        disabled={!selectedDate}
      >
        Next
      </button>
    </div>
  );
};

export const CustomDatePicker: React.FC<{ onDateSelect: (date: string) => void, prevDate?: string }> = ({
  onDateSelect,
  prevDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const emptyDays = startOfMonth.getDay(); // Number of empty days before the 1st

  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isWeekend = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday
  };

  const isPastDate = (day: number) => {
    const today = new Date();
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return date.getTime() < today.getTime(); // Compare without time
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleDateClick = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = (currentMonth.getMonth() + 1).toString().padStart(2, "0");
    const dayPadded = day.toString().padStart(2, "0");

    const selected = `${month}/${dayPadded}/${year}`;
    onDateSelect(selected);
  };

  useEffect(() => {
    if (prevDate) {
      const prevDateObj = new Date(prevDate.split(" ")[0]);
      if (prevDateObj.getMonth() !== currentMonth.getMonth()) {
        setCurrentMonth(prevDateObj);
      }
    }
  }, [prevDate]);

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          onClick={handlePreviousMonth}
          disabled={currentMonth <= new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <span>
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </span>
        <button
          onClick={handleNextMonth}
          disabled={currentMonth > new Date(new Date().getFullYear() + 1, new Date().getMonth(), 1)}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
      <div className="calendar-grid">
        {daysOfWeek.map((day) => (
          <div key={day} className="calendar-cell day-header">
            {day}
          </div>
        ))}
        {Array.from({ length: emptyDays }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-cell empty"></div>
        ))}
        {dates.map((day) => (
          <div
            key={day}
            className={`calendar-cell ${
              isWeekend(day) || isPastDate(day) ? "disabled" : "available"
            }`}
            onClick={() => !isWeekend(day) && !isPastDate(day) && handleDateClick(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

const AppointmentSummary: React.FC<{ previousStep: () => void, pet: PetProfile, service: string, time: string, date: string, user: User }> = ({ user, pet, service, time, date, previousStep }) => {  
  const confirmAppointment = () => {
    addAppointment({
      id: Math.floor(Math.random() * 1000000),
      owner_id: user.id,
      scheduled_date: `${date} ${time}`,
      pet_profile_id: pet.id,
      appointment_status: 'scheduled',
      service: service,
      veterinarian_id: '891ae498-e4a5-44fc-b884-0be8b3385c63',
      cost: 100
    }).then(() => {
      window.location.reload()
    }).catch((error) => {
      console.error('Error adding appointment:', error)
    });
  }

  return (
    <div className="form">
      <FontAwesomeIcon id="backbtn" icon={faArrowLeft} onClick={previousStep} />
      <h2>Appointment Summary</h2>
      <p>Review the details of your appointment.</p>
      <div className="summary-details">
        <div className="summary-pet">
          {pet.species === "dog"
            ? <img src="https://media.istockphoto.com/id/474486193/photo/close-up-of-a-golden-retriever-panting-11-years-old-isolated.jpg?s=612x612&w=0&k=20&c=o6clwQS-h6c90AHlpDPC74vAgtc_y2vvGg6pnb7oCNE=" alt={pet.name} />
            : <img src="https://t3.ftcdn.net/jpg/01/63/55/90/360_F_163559018_oWTwmNBHysXDPj4lh2PPWJDMXOkMYFlD.jpg" alt={pet.name} />
          }
          <h3>{pet.name}</h3>
          <p>{pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}: {pet.breed}</p>
        </div>
        <div className="summary-service">
          <h3>{service}</h3>
          <p>{date} from {time}</p>
        </div>
      </div>
      <button id="confirmbtn" onClick={confirmAppointment}>Confirm Appointment</button>
    </div>
  );
}

export default BookAppointment;