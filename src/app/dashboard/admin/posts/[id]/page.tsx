import { getPostById } from "@/app/actions/posts-actions";
import { PostForm } from "@/components/dashboard/admin/post-form";
import { notFound } from "next/navigation";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }

  return <PostForm initialData={post} />;
}
