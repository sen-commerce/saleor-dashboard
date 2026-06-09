import { useBlogPostDeleteMutation, useBlogPostListQuery } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";

import {
  BlogPostListPage,
  type BlogPostNode,
} from "../components/BlogPostListPage/BlogPostListPage";

export const BlogPostList = () => {
  const navigate = useNavigator();
  const notify = useNotifier();

  const { data, loading, refetch } = useBlogPostListQuery({
    variables: {
      first: 20,
    },
    fetchPolicy: "network-only",
  });

  const [deleteBlogPost] = useBlogPostDeleteMutation({
    onCompleted: data => {
      if (data.blogPostDelete?.errors.length === 0) {
        notify({
          status: "success",
          text: "Blog post deleted successfully",
        });
        refetch();
      } else {
        notify({
          status: "error",
          text: data.blogPostDelete?.errors[0].message || "Failed to delete post",
        });
      }
    },
  });

  const handlePostCreate = () => {
    navigate("/blog/add");
  };

  const handlePostDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      deleteBlogPost({ variables: { id } });
    }
  };

  // Map Relay edges to flat array
  const posts: BlogPostNode[] = data?.blogPosts?.edges.map(edge => edge.node as BlogPostNode) || [];

  return (
    <BlogPostListPage
      posts={posts}
      loading={loading}
      onPostCreate={handlePostCreate}
      onPostDelete={handlePostDelete}
    />
  );
};

export default BlogPostList;
