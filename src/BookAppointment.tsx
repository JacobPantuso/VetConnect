import React, {useState, useEffect, useRef} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faShieldDog } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { User } from './utils/supabase'

type Pet = {
  owner: User | undefined;
  petProfileId: number;
  name: string;
  species: string;
  dateOfBirth: string;
  gender: string;
  weight: number;
  height: number;
  traits: string[];
  allergies: string[];
  vaccinations: string[];
};

interface BookAppointmentProps {
  user?: User;
  fetching?: boolean;
}

function BookAppointment({user, fetching}: BookAppointmentProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPet, setSelectedPet] = useState<Pet>();
  const [selectedService, setSelectedService] = useState<string>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedDate, setSelectedDate] = useState<string>();
  const selectPet = (pet: Pet) => setSelectedPet(pet);
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

  const samplePets: Array<Pet> = [
    {
      owner: user || undefined,
      petProfileId: 101,
      name: "Buddy",
      species: "Dog",
      dateOfBirth: "2020-05-14",
      gender: "Male",
      weight: 30.5,
      height: 60,
      traits: ["Friendly", "Energetic", "Loyal"],
      allergies: ["Peanuts"],
      vaccinations: ["Rabies", "Distemper", "Parvovirus"],
    },
    {
      owner: user || undefined,
      petProfileId: 102,
      name: "Mittens",
      species: "Cat",
      dateOfBirth: "2018-11-22",
      gender: "Female",
      weight: 4.8,
      height: 25,
      traits: ["Curious", "Independent", "Playful"],
      allergies: ["Dairy"],
      vaccinations: ["Feline Viral Rhinotracheitis", "Calicivirus", "Panleukopenia"],
    },
    {
      owner: user || undefined,
      petProfileId: 103,
      name: "Tweety",
      species: "Bird",
      dateOfBirth: "2021-08-01",
      gender: "Male",
      weight: 0.9,
      height: 15,
      traits: ["Talkative", "Cheerful", "Inquisitive"],
      allergies: ["None"],
      vaccinations: ["Avian Influenza", "Newcastle Disease"],
    },
  ];
  
  return (
    <div className="BookAppointment">
      <h2>Book Appointment</h2>
      <p>Book an appointment for your pet.</p>
      <div className="booking">
        {currentStep === 1 && <SelectPet nextStep={nextStep} selectPet={selectPet} pets={samplePets} />}
        {currentStep === 2 && <SelectService nextStep={nextStep} selectService={selectService} previousStep={previousStep} />}
        {currentStep === 3 && <SelectTime nextStep={nextStep} selectDate={selectDate} selectTime={selectTime} previousStep={previousStep} selectedService={selectedService || ''} />}
      </div>
    </div>
  );
}
const SelectPet: React.FC<{ nextStep: () => void, pets: Array<Pet>, selectPet: (pet: Pet) => void }> = ({ nextStep, pets, selectPet }) => {
  return (
    <div className="form">
      <h2>Select a Pet</h2>
      <p>Select a pet to book an appointment for.</p>
      { pets.length > 0
        ?
        <div className="select-pet">
          <select onChange={(e) => selectPet(pets.find(pet => pet.name === e.target.value)!)}>
            {pets.map((pet) => (
              <option key={pet.petProfileId}>{pet.name}</option>
            ))}
          </select>
          <button id="nextbtn" onClick={nextStep}>Next</button>          
        </div>
        :
        <div className="no-pets">
          <FontAwesomeIcon icon={faShieldDog} size="4x" />
          <h4>Appointment Error</h4>
          <p>You currently have no pets. Please create one now to continue.</p>
          <Link to={'/pet-profiles'}>Add Pet</Link>
      </div>
      }
    </div>
  );
};

const SelectService: React.FC<{ nextStep: () => void, previousStep: () => void, selectService: (service: string) => void }> = ({ nextStep, previousStep, selectService }) => {
  return (
    <div className="form">
      <FontAwesomeIcon id="backbtn" icon={faArrowLeft} onClick={previousStep} />
      <h2>Select a Service</h2>
      <p>Select a service to book an appointment for.</p>
      <select onChange={(e) => selectService(e.target.value)}>
        <option>Vaccination (30 Minutes)</option>
        <option>Wellness Exam (1 Hour)</option>
        <option>Boarding (1 Hour)</option>
        <option>Grooming (1-2 Hours)</option>
      </select>
      <p className="dropdown-subtitle">One service per appointment. To book multiple services,<br></br> you'll need to create another appointment.</p>
      <button id="nextbtn" onClick={nextStep}> Next</button>          
    </div>
  );
}

const SelectTime: React.FC<{ nextStep: () => void, previousStep: () => void, selectTime: (time: string) => void, selectDate: (date: string) => void, selectedService: string}> = ({ nextStep, previousStep, selectTime, selectDate, selectedService}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Extract duration from the selectedService
  const duration = parseInt(
    selectedService.match(/\((\d+)\)/)?.[1] || "30",
    10
  );

  // Function to convert 24-hour time to 12-hour time with AM/PM
  const formatTime = (hours: number, minutes: number) => {
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // Generate time slots with 12-hour format
  const generateTimeSlots = () => {
    const slots: string[] = [];
    let currentTime = new Date();
    currentTime.setHours(9, 0, 0, 0); // Start at 9:00 AM

    while (currentTime.getHours() < 17) {
      const start = formatTime(currentTime.getHours(), currentTime.getMinutes());
      currentTime.setMinutes(currentTime.getMinutes() + duration); // Add duration
      if (currentTime.getHours() >= 17 && currentTime.getMinutes() > 0) break; // Stop after 5:00 PM
      const end = formatTime(currentTime.getHours(), currentTime.getMinutes());
      slots.push(`${start} - ${end}`);
    }

    return slots;
  };


  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    selectDate(date);
    setAvailableTimes(generateTimeSlots());
    setShowDatePicker(false); // Close date picker
  };

  return (
    <div className="form">
      <FontAwesomeIcon id="backbtn" icon={faArrowLeft} onClick={previousStep} />
      <h2 className="form-title">Select Date and Time</h2>
      <p className="form-subtitle">
        Select a date and time for your appointment.
      </p>

      {/* Custom Date Picker */}
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

      {/* Time Slots */}
      {selectedDate && (
        <div className="time-slots">
          <h4 className="time-slots-title">Available Times:</h4>
          <div className="time-slots-container">
            {availableTimes.length > 0 ? (
              availableTimes.map((time) => (
                <button
                  key={formatTime(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]))}
                  className="time-slot-button"
                  onClick={() => selectTime(time)}
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


      <button id="nextbtn" style={{width: '50%', margin: 'auto'}} onClick={nextStep} disabled={!selectedDate}>
        Next
      </button>
    </div>
  );
};

const CustomDatePicker: React.FC<{ onDateSelect: (date: string) => void }> = ({
  onDateSelect,
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
    const selected = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    ).toLocaleDateString("en-GB");
    onDateSelect(selected);
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          onClick={handlePreviousMonth}
          disabled={currentMonth <= new Date()}
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
              isWeekend(day) ? "disabled" : "available"
            }`}
            onClick={() => !isWeekend(day) && handleDateClick(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookAppointment;