import { Database } from "./supabase";

export type LessonType = Database["public"]["Tables"]["lesson"]["Row"];
export type ProfileType = Database["public"]["Tables"]["profile"]["Row"];
export type PremiumContentType =
  Database["public"]["Tables"]["premium_content"]["Row"];
