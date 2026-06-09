import {
  useBlogAuthorCreateMutation,
  useBlogAuthorListQuery,
  useBlogCategoryCreateMutation,
  useBlogCategoryListQuery,
  useBlogPostCreateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";

import {
  type BlogPostDetailsData,
  BlogPostDetailsPage,
} from "../components/BlogPostDetailsPage/BlogPostDetailsPage";

export const BlogPostCreate = () => {
  const navigate = useNavigator();
  const notify = useNotifier();

  const { data: authorData, refetch: refetchAuthors } = useBlogAuthorListQuery({
    variables: { first: 100 },
  });

  const { data: categoryData, refetch: refetchCategories } = useBlogCategoryListQuery({
    variables: { first: 100 },
  });

  const [createBlogPost, createPostOpts] = useBlogPostCreateMutation({
    onCompleted: data => {
      if (data.blogPostCreate?.errors.length === 0) {
        notify({
          status: "success",
          text: "Blog post created successfully",
        });
        navigate("/blog");
      } else {
        notify({
          status: "error",
          text: data.blogPostCreate?.errors[0].message || "Failed to create blog post",
        });
      }
    },
  });

  const [createAuthor] = useBlogAuthorCreateMutation();
  const [createCategory] = useBlogCategoryCreateMutation();

  const handleQuickAuthorCreate = async (name: string) => {
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
    createBlogPost({
      variables: {
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

  return (
    <BlogPostDetailsPage
      initialData={null}
      authors={authors}
      categories={categories}
      loading={createPostOpts.loading}
      onSave={handleSave}
      onCancel={() => navigate("/blog")}
      onQuickAuthorCreate={handleQuickAuthorCreate}
      onQuickCategoryCreate={handleQuickCategoryCreate}
    />
  );
};

export default BlogPostCreate;
