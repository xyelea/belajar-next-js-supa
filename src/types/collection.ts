import { Database } from "./supabase";

export type LessonType = Database["public"]["Tables"]["lesson"]["Row"];
