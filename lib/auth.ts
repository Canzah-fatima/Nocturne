
import { createServerSupabaseClient } from "./supabase-server";
import { supabase } from "./supabase";
import type { PublicUser } from "./types";

/**
 * Retrieves the currently authenticated user session on the server
 * using secure token verification via getUser().
 */
export async function getSession(): Promise<PublicUser | null> {
  try {
    const serverSupabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await serverSupabase.auth.getUser();

    if (error || !user) return null;

    const role = (user.app_metadata?.role ||
      user.user_metadata?.role ||
      "CUSTOMER") as PublicUser["role"];

    const displayName =
      user.user_metadata?.name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "User";

    return {
      id: user.id,
      name: displayName,
      email: user.email ?? "",
      role,
    };
  } catch (err) {
    console.error("Error retrieving user session on server:", err);
    return null;
  }
}

/**
 * Client/Server sign-out handler to terminate auth sessions.
 */
export async function clearSession(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      throw error;
    }
  } catch (err) {
    console.error("Sign-out failed:", err);
    throw err;
  }
}