import {
  useBlogAuthorCreateMutation,
  useBlogAuthorListQuery,
  useBlogCategoryCreateMutation,
  useBlogCategoryListQuery,
  useBlogPostDetailsQuery,
  useBlogPostUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { type RouteComponentProps } from "react-router-dom";

import {
  type BlogPostDetailsData,
  BlogPostDetailsPage,
} from "../components/BlogPostDetailsPage/BlogPostDetailsPage";

interface BlogPostDetailsProps extends RouteComponentProps<{ id: string }> {}

export const BlogPostDetails = ({ match }: BlogPostDetailsProps) => {
  const id = decodeURIComponent(match.params.id);
  const navigate = useNavigator();
  const notify = useNotifier();

  const {
    data: blogData,
    loading: blogLoading,
    refetch: refetchDetails,
  } = useBlogPostDetailsQuery({
    variables: { id },
    fetchPolicy: "network-only",
  });

  const { data: authorData, refetch: refetchAuthors } = useBlogAuthorListQuery({
    variables: { first: 100 },
  });

  const { data: categoryData, refetch: refetchCategories } = useBlogCategoryListQuery({
    variables: { first: 100 },
  });

  const [updateBlogPost, updatePostOpts] = useBlogPostUpdateMutation({
    onCompleted: data => {
      if (data.blogPostUpdate?.errors.length === 0) {
        notify({
          status: "success",
          text: "Blog post updated successfully",
        });
        refetchDetails();
        navigate("/blog");
      } else {
        notify({
          status: "error",
          text: data.blogPostUpdate?.errors[0].message || "Failed to update blog post",
        });
      }
    },
  });

  const [createAuthor] = useBlogAuthorCreateMutation();
  const [createCategory] = useBlogCategoryCreateMutation();

  const handleQuickAuthorCreate = async (name: string) => {
    // Slug generation helper
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");

    try {
      const res = await createAuthor({
        variables: {
          input: { name, slug, bio: "Quick created author profile." },
        },
      });

      if (res.data?.blogAuthorCreate?.errors.length === 0) {
        notify({
          status: "success",
          text: `Author ${name} created`,
        });
        refetchAuthors();

        return res.data.blogAuthorCreate.blogAuthor?.id || null;
      } else {
        notify({
          status: "error",
          text: res.data?.blogAuthorCreate?.errors[0].message || "Failed to create author",
        });
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  };

  const handleQuickCategoryCreate = async (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");

    try {
      const res = await createCategory({
        variables: {
          input: { name, slug, description: "Quick created category." },
        },
      });

      if (res.data?.blogCategoryCreate?.errors.length === 0) {
        notify({
          status: "success",
          text: `Category ${name} created`,
        });
        refetchCategories();

        return res.data.blogCategoryCreate.blogCategory?.id || null;
      } else {
        notify({
          status: "error",
          text: res.data?.blogCategoryCreate?.errors[0].message || "Failed to create category",
        });
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  };

  const handleSave = (formData: BlogPostDetailsData) => {
    updateBlogPost({
      variables: {
        id,
        input: {
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          featuredComments: formData.featuredComments,
          featuredImage: formData.featuredImage,
          readingTimeMinutes: formData.readingTimeMinutes,
          isPublished: formData.isPublished,
          publishedAt: formData.publishedAt,
          author: formData.authorId || null,
          category: formData.categoryId || null,
        },
      },
    });
  };

  const authors = authorData?.blogAuthors?.edges.map(e => e.node) || [];
  const categories = categoryData?.blogCategories?.edges.map(e => e.node) || [];

  const post = blogData?.blogPost;
  const initialData: BlogPostDetailsData | null = post
    ? {
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content || "",
        featuredComments: post.featuredComments || "",
        featuredImage: post.featuredImage || "",
        readingTimeMinutes: post.readingTimeMinutes || 5,
        isPublished: !!post.isPublished,
        publishedAt: post.publishedAt,
        authorId: post.author?.id || "",
        categoryId: post.category?.id || "",
      }
    : null;

  return (
    <BlogPostDetailsPage
      initialData={initialData}
      authors={authors}
      categories={categories}
      loading={blogLoading || updatePostOpts.loading}
      onSave={handleSave}
      onCancel={() => navigate("/blog")}
      onQuickAuthorCreate={handleQuickAuthorCreate}
      onQuickCategoryCreate={handleQuickCategoryCreate}
    />
  );
};

export default BlogPostDetails;
