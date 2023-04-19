import { supabase } from "@/utils/supabase";
import { LessonType } from "../../../types/collection";

interface LessonDetailsProps {
  lesson: LessonType;
}

interface LessonDetailsParams {
  id: string;
}

const LessonDetails = ({ lesson }: LessonDetailsProps) => {
  console.log(lesson);
  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-8">
      <h1 className="text-3xl mb-6">{lesson.title}</h1>
      <p>{lesson.description}</p>
    </div>
  );
};

export const getStaticPaths = async () => {
  const { data: lessons } = await supabase.from("lesson").select("id");

  const paths = lessons?.map(({ id }) => ({
    params: {
      id: id.toString(),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({
  params: { id },
}: {
  params: LessonDetailsParams;
}) => {
  const { data: lesson } = await supabase
    .from("lesson")
    .select("*")
    .eq("id", id)
    .single();

  return {
    props: {
      lesson,
    },
  };
};

export default LessonDetails;
