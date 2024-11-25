import { createClient, AuthChangeEvent } from "@supabase/supabase-js";
import { profile } from "console";
import React, { useState, useEffect } from "react";
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "";
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Key");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

interface UserSession {
  user: User | null;
  fetching: boolean;
}

export interface User {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  setup: boolean;
  petProfiles: PetProfile[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  paymentForms: PaymentForm[];
}
export interface PetProfile {
  id: number;
  owner_id: string;
  name: string;
  species: string;
  breed: string;
  date_of_birth: string;
  gender: "male" | "female" | "unknown";
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
  status: "pending" | "paid" | "failed";
  owner_id: string;
  appointment_id: number;
  pet_profile_id: number;
}

export interface Appointment {
  id: number;
  owner_id: string;
  scheduled_date: string;
  pet_profile_id: number;
  appointment_status: "scheduled" | "completed" | "cancelled";
  service: string;
  veterinarian_id: string;
  cost: number;
}

export const useUserSession = (): UserSession => {
  const [user, setUser] = useState<User | null>(null);
  const [fetching, setFetching] = useState(true);
  useEffect(() => {
    const fetchUserAndData = async () => {
      try {
        // Fetch authenticated user
        const { data: authData, error: authError } =
          await supabase.auth.getUser();
        if (authError) {
          console.error("Error fetching authenticated user:", authError);
          setFetching(false);
          return;
        }

        const userId = authData?.user?.id;
        if (!userId) {
          console.warn("No user ID found.");
          setFetching(false);
          return;
        }

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single<User>();

        if (profileError || !profileData) {
          console.error("Error fetching user profile:", profileError);
          setUser(null);
          setFetching(false);
          return;
        }

        // Fetch related data in parallel
        const [petProfiles, appointments, medicalRecords, paymentForms] =
          await Promise.all([
            fetchPetProfiles(userId),
            fetchAppointments({ownerId: userId}),
            fetchMedicalRecords(userId),
            fetchPaymentForms({ownerId: userId}),
          ]);

        // Combine all data into the user object
        const completeUser = {
          ...profileData,
          petProfiles,
          appointments,
          medicalRecords,
          paymentForms,
        };

        // Update state
        setUser(completeUser);
      } catch (error) {
        console.error("Error during data fetching:", error);
        setUser(null);
      } finally {
        setFetching(false);
      }
    };
    fetchUserAndData();

    // Handle authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session) => {
        const currentUserId = session?.user?.id;

        // Handle session changes
        if (event === "SIGNED_IN" || event === "USER_UPDATED") {
          if (!user || user.id !== currentUserId) {
            fetchUserAndData();
          }
        } else if (event === "SIGNED_OUT") {
          // Clear user state on sign-out
          setUser(null);
          setFetching(false);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { user, fetching };
};

export const setupProfile = async (
  firstName: string,
  lastName: string,
  userId: string
): Promise<void> => {
  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
      setup: true,
    })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }

  console.log("User profile updated successfully");
};

export const fetchPetProfiles = async (
  ownerId?: string
): Promise<PetProfile[]> => {
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
  updates: Partial<Omit<PetProfile, "pet_id">>
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

export const deletePetProfile = async (
  petProfile: PetProfile
): Promise<void> => {
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

export const fetchMedicalRecords = async (
  ownerId?: string
): Promise<MedicalRecord[]> => {
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

export const addMedicalRecord = async (
  medicalRecord: MedicalRecord
): Promise<void> => {
  const { error } = await supabase
    .from("medical_records")
    .insert(medicalRecord);

  if (error) {
    console.error("Error adding medical record:", error);
    throw error;
  }

  console.log("Medical record added successfully");
};

export const updateMedicalRecord = async (
  medicalRecordId: number,
  updates: Partial<Omit<MedicalRecord, "medical_record_id">>
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

export const deleteMedicalRecord = async (
  medicalRecord: MedicalRecord
): Promise<void> => {
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

export const fetchPaymentForms = async ({
  ownerId,
  appointmentId,
  petProfileId,
  status,
}: {
  ownerId?: string;
  appointmentId?: number;
  petProfileId?: number;
  status?: "pending" | "paid" | "failed";
}): Promise<PaymentForm[]> => {
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

export const addPaymentForm = async (
  paymentForm: PaymentForm
): Promise<void> => {
  const { error } = await supabase.from("payment_forms").insert(paymentForm);

  if (error) {
    console.error("Error adding payment form:", error);
    throw error;
  }

  console.log("Payment form added successfully");
};

export const updatePaymentForm = async (
  paymentFormId: number,
  updates: Partial<Omit<PaymentForm, "payment_form_id">>
): Promise<void> => {
  const { error } = await supabase
    .from("payment_forms")
    .update(updates)
    .eq("id", paymentFormId);

  if (error) {
    console.error("Error updating payment form:", error);
    throw error;
  }

  console.log("Payment form updated successfully");
};

export const deletePaymentForm = async (
  paymentForm: PaymentForm
): Promise<void> => {
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


export const fetchAppointments = async ({
  ownerId,
  appointmentId,
  petProfileId,
  status,
}: {
  ownerId?: string,
  appointmentId?: number,
  petProfileId?: number,
  status?: "scheduled" | "completed" | "cancelled",
}): Promise<Appointment[]> => {
  let query = supabase.from("appointments").select("*");

  if (ownerId) {
    query = query.eq("owner_id", ownerId);
  }

  if (appointmentId) {
    query = query.eq("id", appointmentId);
  }

  if (petProfileId) {
    query = query.eq("pet_profile_id", petProfileId);
  }

  if (status) {
    query = query.eq("appointment_status", status);
  }

  const { data, error } = await query;
  data?.sort((a, b) => {
    if (a.appointment_status === "scheduled" && b.appointment_status !== "scheduled") {
      return -1;
    }
    if (a.appointment_status !== "scheduled" && b.appointment_status === "scheduled") {
      return 1;
    }
    const dateA = new Date(a.scheduled_date.split(" ")[0]);
    const dateB = new Date(b.scheduled_date.split(" ")[0]);
    return dateA.getTime() - dateB.getTime();
  });

  if (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }

  return data || [];
};

export const addAppointment = async (
  appointment: Appointment
): Promise<void> => {
  const { error } = await supabase.from("appointments").insert(appointment);

  if (error) {
    console.error("Error adding appointment:", error);
    throw error;
  }

  console.log("Appointment added successfully");
};

export const updateAppointment = async (
  appointmentId: number,
  updates: Partial<Omit<Appointment, "appointment_id">>
): Promise<void> => {
  const { error } = await supabase
    .from("appointments")
    .update(updates)
    .eq("id", appointmentId);

  if (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }

  console.log("Appointment updated successfully");
};

export const deleteAppointment = async (
  appointment: Appointment
): Promise<void> => {
  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", appointment.id);

  if (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }

  console.log("Appointment deleted successfully");
};
