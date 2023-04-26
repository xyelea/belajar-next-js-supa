import { supabase } from "@/utils/supabase";
import { LessonType } from "@/types/collection";
import Link from "next/link";

// const getUser = async () => {
//   try {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     console.log(user);
//     if (!user) {
//       console.log("user tidak ditemukan");
//     }
//   } catch (error: any) {
//     console.log(`Error: ${error.message}`);
//   }
// };

export default function Home({ lessons }: { lessons: LessonType[] }) {
  console.log("user", supabase.auth.getUser());
  return (
    <div className="w-full max-w-3xl mx-auto my-16 px-2">
      {lessons.map((lesson) => (
        <Link
          href={`/${lesson.id}`}
          key={lesson.id}
          className="p-8 h-40 mb-4 rounded shadow text-xl flex">
          {lesson.title}
        </Link>
      ))}
    </div>
  );
}

export const getStaticProps = async () => {
  const { data: lessons } = await supabase.from("lesson").select("*");

  return {
    props: {
      lessons,
    },
  };
};
