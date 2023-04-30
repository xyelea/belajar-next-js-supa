import { supabase } from "@/utils/supabase";
import { LessonType } from "@/types/collection";
import { PremiumContentType } from "@/types/collection";
import { useEffect, useState } from "react";
import Video from "react-player";

const LessonDetails = ({ lesson }: { lesson: LessonType }) => {
  const [videoUrl, setVideoUrl] = useState<string>();

  const getPremiumContent = async () => {
    const { data } = await supabase
      .from("premium_content")
      .select("video_url")
      .eq("id", lesson.id)
      .single();

    if (data?.video_url) {
      setVideoUrl(data.video_url);
    }
  };

  console.log(lesson);

  useEffect(() => {
    getPremiumContent();
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto py-16 px8">
      <h1 className="text-3xl mb-6">{lesson.title}</h1>
      <p className="mb-8">{lesson.description}</p>
      {!!videoUrl && <Video url={videoUrl} width="100%" controls />}
      {!videoUrl && (
        <p className="py-6 px-4 rounded bg-purple-100 border border-solid border-violet-400 text-violet-600 text-center">
          Silahkan berlangganan terlebih dahulu sebelum melihat konten
        </p>
      )}
    </div>
  );
};

type Params = {
  params: {
    id: string;
  };
};

export const getStaticPaths = async () => {
  const { data: lessons } = await supabase.from("lesson").select("id");

  const paths = lessons?.map(({ id }) => ({
    params: { id: id.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { id } }: Params) => {
  const { data: lesson } = await supabase
    .from("lesson")
    .select()
    .eq("id", id)
    .single();

  return {
    props: {
      lesson,
    },
  };
};

export default LessonDetails;
