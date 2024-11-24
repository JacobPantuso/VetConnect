import { createClient } from "@supabase/supabase-js";
import { profile } from "console";
import React, {useState, useEffect} from "react";
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

interface UserSession {
  user: User | null;
  fetching: boolean;
  petProfiles: PetProfile[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  paymentForms: PaymentForm[];
}

export interface User {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  setup: boolean;
}
export interface PetProfile {
  id: number;
  owner_id: string;
  name: string;
  species: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'unknown';
  weight: number;
  height: number;
  traits: string[];
}
export interface MedicalRecord {
  id: number;
  date: string;
  owner_id: string;
  veterinarian_id: string;
  symptoms: string[];
  notes: string;
  pet_profile_id: number;
}

export interface PaymentForm {
  id: number;
  created_at: string;
  charge: number;
  notes: string;
  status: 'pending' | 'paid' | 'failed';
  ownder_id: string;
  appointment_id: number;
  pet_profile_id: number;
}

export interface Appointment {
  id: number;
  scheduled_date: string;
  pet_profile_id: number;
  appointment_status: 'scheduled' | 'completed' | 'cancelled';
  service: string;
  veterinarian_id: string;
  cost: number;
}


export const useUserSession = (): UserSession => {
  const [user, setUser] = useState<User | null>(null);
  const [fetching, setFetching] = useState(true);
  const [petProfiles, setPetProfiles] = useState<PetProfile[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [paymentForms, setPaymentForms] = useState<PaymentForm[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        setFetching(false);
        return;
      }

      const userId = authData?.user?.id;
      if (!userId) {
        setFetching(false);
        return;
      }
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single<User>();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        setUser(null);
      } else if (profileData?.setup !== undefined) {
        setUser(profileData);
      } else {
        console.warn("Profile data is missing the 'setup' field.");
        setUser(null);
      }

      setFetching(false);
    };

    fetchUser();

    const fetchUserData = async () => {
      if (!user) {
        return;
      }
      const [petProfiles, appointments, medicalRecords, paymentForms] = await Promise.all([
        fetchPetProfiles(user.id),
        fetchAppointments(user.id),
        fetchMedicalRecords(user.id),
        fetchPaymentForms(user.id)
      ]);
      setPetProfiles(petProfiles);
      setAppointments(appointments);
      setMedicalRecords(medicalRecords);
      setPaymentForms(paymentForms);
    }

    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null);
        setFetching(false);
      } else {
        fetchUser();
        fetchUserData();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  return { user, fetching, petProfiles, appointments, medicalRecords, paymentForms };
};

export const setupProfile = async (firstName: string, lastName: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({
      first_name: firstName,
      last_name: lastName,
      setup: true
    })
    .eq('id', userId);

  if (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
  
  console.log("User profile updated successfully");
};

export const fetchPetProfiles = async (ownerId?: string): Promise<PetProfile[]> => {
  let query = supabase.from("pet_profiles").select("*");

  if (ownerId) {
    query = query.eq("owner_id", ownerId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching pet profiles:", error);
    throw error;
  }

  return data || [];
};

export const addPetProfile = async (petProfile: PetProfile): Promise<void> => {
  const { error } = await supabase.from("pet_profiles").insert(petProfile);

  if (error) {
    console.error("Error adding pet profile:", error);
    throw error;
  }

  console.log("Pet profile added successfully");
};

export const updatePetProfile = async (
  pet_id: number,
  updates: Partial<Omit<PetProfile, 'pet_id'>>
): Promise<void> => {
  const { error } = await supabase
    .from("pet_profiles")
    .update(updates)
    .eq("pet_id", pet_id);

  if (error) {
    console.error("Error updating pet profile:", error);
    throw error;
  }

  console.log("Pet profile updated successfully");
};


export const deletePetProfile = async (petProfile: PetProfile): Promise<void> => {
  const { error } = await supabase
    .from("pet_profiles")
    .delete()
    .eq("pet_id", petProfile.id);

  if (error) {
    console.error("Error deleting pet profile:", error);
    throw error;
  }

  console.log("Pet profile deleted successfully");
};

export const fetchMedicalRecords = async (ownerId?: string): Promise<MedicalRecord[]> => {
  let query = supabase.from("medical_records").select("*");

  if (ownerId) {
    query = query.eq("owner_id", ownerId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching medical records:", error);
    throw error;
  }

  return data || [];
};

export const addMedicalRecord = async (medicalRecord: MedicalRecord): Promise<void> => {
  const { error } = await supabase.from("medical_records").insert(medicalRecord);

  if (error) {
    console.error("Error adding medical record:", error);
    throw error;
  }

  console.log("Medical record added successfully");
};

export const updateMedicalRecord = async (
  medicalRecordId: number,
  updates: Partial<Omit<MedicalRecord, 'medical_record_id'>>
): Promise<void> => {
  const { error } = await supabase
    .from("medical_records")
    .update(updates)
    .eq("medical_record_id", medicalRecordId);

  if (error) {
    console.error("Error updating medical record:", error);
    throw error;
  }

  console.log("Medical record updated successfully");
};


export const deleteMedicalRecord = async (medicalRecord: MedicalRecord): Promise<void> => {
  const { error } = await supabase
    .from("medical_records")
    .delete()
    .eq("medical_record_id", medicalRecord.id);

  if (error) {
    console.error("Error deleting medical record:", error);
    throw error;
  }

  console.log("Medical record deleted successfully");
};

export const fetchPaymentForms = async (ownerId?: string, appointmentId?: number, petProfileId?: number, status?: 'pending' | 'paid' | 'failed'): Promise<PaymentForm[]> => {
  let query = supabase.from("payment_forms").select("*");

  if (ownerId) {
    query = query.eq("owner_id", ownerId);
  }
  if (appointmentId) {
    query = query.eq("appointment_id", appointmentId);
  }
  if (petProfileId) {
    query = query.eq("pet_profile_id", petProfileId);
  }
  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching payment forms:", error);
    throw error;
  }

  return data || [];
};

export const addPaymentForm = async (paymentForm: PaymentForm): Promise<void> => {
  const { error } = await supabase.from("payment_forms").insert(paymentForm);

  if (error) {
    console.error("Error adding payment form:", error);
    throw error;
  }

  console.log("Payment form added successfully");
};

export const updatePaymentForm = async (
  paymentFormId: number,
  updates: Partial<Omit<PaymentForm, 'payment_form_id'>>
): Promise<void> => {
  const { error } = await supabase
    .from("payment_forms")
    .update(updates)
    .eq("payment_form_id", paymentFormId);

  if (error) {
    console.error("Error updating payment form:", error);
    throw error;
  }

  console.log("Payment form updated successfully");
};


export const deletePaymentForm = async (paymentForm: PaymentForm): Promise<void> => {
  const { error } = await supabase
    .from("payment_forms")
    .delete()
    .eq("payment_form_id", paymentForm.id);

  if (error) {
    console.error("Error deleting payment form:", error);
    throw error;
  }

  console.log("Payment form deleted successfully");
};

export const fetchAppointments = async (ownerId?: string, petProfileId?: number, status?: 'scheduled' | 'completed' | 'cancelled'): Promise<Appointment[]> => {
  let query = supabase.from("appointments").select("*");

  if (ownerId) {
    query = query.eq("owner_id", ownerId);
  }

  if (petProfileId) {
    query = query.eq("pet_profile_id", petProfileId);
  }

  if (status) {
    query = query.eq("appointment_status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }

  return data || [];
};

export const addAppointment = async (appointment: Appointment): Promise<void> => {
  const { error } = await supabase.from("appointments").insert(appointment);

  if (error) {
    console.error("Error adding appointment:", error);
    throw error;
  }

  console.log("Appointment added successfully");
};

export const updateAppointment = async (
  appointmentId: number,
  updates: Partial<Omit<Appointment, 'appointment_id'>>
): Promise<void> => {
  const { error } = await supabase
    .from("appointments")
    .update(updates)
    .eq("appointment_id", appointmentId);

  if (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }

  console.log("Appointment updated successfully");
};


export const deleteAppointment = async (appointment: Appointment): Promise<void> => {
  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("appointment_id", appointment.id);

  if (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }

  console.log("Appointment deleted successfully");
};