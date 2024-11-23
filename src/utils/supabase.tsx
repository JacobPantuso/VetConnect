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

}

export const useUserSession = (): UserSession => {
  const [user, setUser] = useState<User | null>(null);
  const [fetching, setFetching] = useState(true);

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

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null);
        setFetching(false);
      } else {
        fetchUser();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { user, fetching };
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