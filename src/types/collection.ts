import { Database } from "./supabase";

export type LessonType = Database["public"]["Tables"]["lesson"]["Row"];
export type ProfileType = Database["public"]["Tables"]["profile"]["Row"];
