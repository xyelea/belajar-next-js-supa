import { supabase } from "../utils/supabase";
import Link from "next/link";

interface Lesson {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

interface Props {
  lessons: Lesson[];
}

export default function Home({ lessons }: Props) {
  async function getUserData() {
    try {
      const data = await supabase.auth.getUser();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  getUserData();

  return (
    <main className="w-full max-w-3xl mx-auto my-16 px-2">
      {lessons.map((lesson) => (
        <Link key={lesson.id} href={`/${lesson.id}`}>
          <p className="p-8 h-40 mb-4 rounded shadow text-xl flex">
            {lesson.title}
          </p>
        </Link>
      ))}
    </main>
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
