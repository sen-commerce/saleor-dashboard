import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import {
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Switch,
  TextField,
} from "@material-ui/core";
import { Box, Button } from "@saleor/macaw-ui-next";
import { Clock, Image as ImageIcon, Plus } from "lucide-react";
import type * as React from "react";
import { useEffect, useState } from "react";

import { BlogEditor } from "../BlogEditor/BlogEditor";
import {
  type Comment,
  FeaturedCommentsEditor,
} from "../FeaturedCommentsEditor/FeaturedCommentsEditor";

export interface BlogPostDetailsData {
  id?: string;
  title: string;
  slug: string;
  content: string; // JSON String
  featuredComments: string; // JSON String
  featuredImage: string;
  readingTimeMinutes: number;
  isPublished: boolean;
  publishedAt?: string | null;
  authorId: string;
  categoryId: string;
}

interface BlogPostDetailsPageProps {
  initialData: BlogPostDetailsData | null;
  authors: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
  loading: boolean;
  onSave: (data: BlogPostDetailsData) => void;
  onCancel: () => void;
  onQuickAuthorCreate: (name: string) => Promise<string | null>;
  onQuickCategoryCreate: (name: string) => Promise<string | null>;
}

export const BlogPostDetailsPage = ({
  initialData,
  authors = [],
  categories = [],
  loading,
  onSave,
  onCancel,
  onQuickAuthorCreate,
  onQuickCategoryCreate,
}: BlogPostDetailsPageProps) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [featuredImage, setFeaturedImage] = useState("");
  const [readingTime, setReadingTime] = useState(5);
  const [isPublished, setIsPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState<string>("");
  const [authorId, setAuthorId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [isSlugManual, setIsSlugManual] = useState(false);

  // Initialize form state when initialData loads
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSlug(initialData.slug || "");
      setFeaturedImage(initialData.featuredImage || "");
      setReadingTime(initialData.readingTimeMinutes || 5);
      setIsPublished(initialData.isPublished || false);
      setPublishedAt(initialData.publishedAt ? initialData.publishedAt.split("T")[0] : "");
      setAuthorId(initialData.authorId || "");
      setCategoryId(initialData.categoryId || "");
      setIsSlugManual(!!initialData.slug);

      try {
        setContent(initialData.content ? JSON.parse(initialData.content) : null);
      } catch (e) {
        setContent(null);
      }

      try {
        setComments(initialData.featuredComments ? JSON.parse(initialData.featuredComments) : []);
      } catch (e) {
        setComments([]);
      }
    }
  }, [initialData]);

  // Auto-generate slug from title if not manually edited
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);

    if (!isSlugManual) {
      const generated = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

      setSlug(generated);
    }
  };

  const handleQuickAuthor = async () => {
    const name = window.prompt("Enter new author name:");

    if (name) {
      const id = await onQuickAuthorCreate(name);

      if (id) {
        setAuthorId(id);
      }
    }
  };

  const handleQuickCategory = async () => {
    const name = window.prompt("Enter new category name:");

    if (name) {
      const id = await onQuickCategoryCreate(name);

      if (id) {
        setCategoryId(id);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id,
      title,
      slug,
      content: JSON.stringify(content),
      featuredComments: JSON.stringify(comments),
      featuredImage,
      readingTimeMinutes: Number(readingTime),
      isPublished,
      publishedAt: isPublished
        ? publishedAt
          ? `${publishedAt}T00:00:00Z`
          : new Date().toISOString()
        : null,
      authorId,
      categoryId,
    });
  };

  return (
    <DetailPageLayout>
      <TopNav title={initialData?.id ? `Edit: ${initialData.title}` : "New Blog Post"} href="/blog">
        <Box display="flex" gap={3}>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Post"}
          </Button>
        </Box>
      </TopNav>

      <DetailPageLayout.Content>
        {/* Left Column — Content, Editor, Comments */}
        <Box display="flex" flexDirection="column" gap={6}>
          <DashboardCard>
            <Box padding={6} display="flex" flexDirection="column" gap={4}>
              <TextField
                label="Article Title"
                value={title}
                onChange={e => handleTitleChange(e.target.value)}
                variant="outlined"
                fullWidth
                required
              />

              <TextField
                label="Slug / URL Path"
                value={slug}
                onChange={e => {
                  setSlug(e.target.value);
                  setIsSlugManual(true);
                }}
                variant="outlined"
                fullWidth
                required
                helperText="URL friendly identifier, e.g., 'how-to-start-ecommerce'"
              />
            </Box>
          </DashboardCard>

          <DashboardCard>
            <Box padding={6}>
              <h3 style={{ fontSize: "16px", fontWeight: 600, marginTop: 0, marginBottom: "12px" }}>
                Article Body
              </h3>
              <BlogEditor
                initialValue={initialData?.content ? initialData.content : null}
                onChange={val => setContent(val)}
              />
            </Box>
          </DashboardCard>

          <DashboardCard>
            <Box padding={6}>
              <FeaturedCommentsEditor
                comments={comments}
                onChange={newComments => setComments(newComments)}
              />
            </Box>
          </DashboardCard>
        </Box>
      </DetailPageLayout.Content>

      <DetailPageLayout.RightSidebar>
        {/* Right Column — Publishing settings, tags, authors, settings */}
        <Box display="flex" flexDirection="column" gap={6}>
          {/* Publish Options */}
          <DashboardCard>
            <Box padding={6} display="flex" flexDirection="column" gap={4}>
              <h4 style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>Publish Status</h4>
              <FormControlLabel
                control={
                  <Switch
                    checked={isPublished}
                    onChange={e => setIsPublished(e.target.checked)}
                    color="primary"
                  />
                }
                label={isPublished ? "Visible to Public" : "Draft (Hidden)"}
              />

              {isPublished && (
                <TextField
                  label="Publish Date"
                  type="date"
                  value={publishedAt}
                  onChange={e => setPublishedAt(e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  InputProps={{
                    style: { height: 56 },
                  }}
                />
              )}
            </Box>
          </DashboardCard>

          {/* Organization Options */}
          <DashboardCard>
            <Box padding={6} display="flex" flexDirection="column" gap={4}>
              <h4 style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>Organization</h4>

              {/* Author field */}
              <Box display="flex" flexDirection="column" gap={2}>
                <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
                  <TextField
                    select
                    label="Author"
                    value={authorId}
                    onChange={e => setAuthorId(e.target.value as string)}
                    variant="outlined"
                    style={{ flex: 1 }}
                    fullWidth
                    InputProps={{
                      style: { height: 56 },
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {authors.map(a => (
                      <MenuItem key={a.id} value={a.id}>
                        {a.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <IconButton
                    onClick={handleQuickAuthor}
                    style={{
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      width: "56px",
                      flexShrink: 0,
                      padding: 0,
                    }}
                  >
                    <Plus size={16} />
                  </IconButton>
                </div>
              </Box>

              {/* Category field */}
              <Box display="flex" flexDirection="column" gap={2}>
                <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
                  <TextField
                    select
                    label="Category"
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value as string)}
                    variant="outlined"
                    style={{ flex: 1 }}
                    fullWidth
                    InputProps={{
                      style: { height: 56 },
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {categories.map(c => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <IconButton
                    onClick={handleQuickCategory}
                    style={{
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      width: "56px",
                      flexShrink: 0,
                      padding: 0,
                    }}
                  >
                    <Plus size={16} />
                  </IconButton>
                </div>
              </Box>

              {/* Reading time */}
              <TextField
                label="Reading Time"
                type="number"
                value={readingTime}
                onChange={e => setReadingTime(Number(e.target.value))}
                variant="outlined"
                InputProps={{
                  style: { height: 56 },
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      style={{
                        height: "100%",
                        maxHeight: "none",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Clock size={16} style={{ color: "#64748b", transform: "translateY(6px)" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      style={{
                        height: "100%",
                        maxHeight: "none",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      min
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </Box>
          </DashboardCard>

          {/* Media / Image */}
          <DashboardCard>
            <Box padding={6} display="flex" flexDirection="column" gap={4}>
              <h4 style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>Featured Image</h4>
              <TextField
                label="Image URL"
                value={featuredImage}
                onChange={e => setFeaturedImage(e.target.value)}
                variant="outlined"
                InputProps={{
                  style: { height: 56 },
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      style={{
                        height: "100%",
                        maxHeight: "none",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ImageIcon
                        size={16}
                        style={{ color: "#64748b", transform: "translateY(6px)" }}
                      />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                helperText="URL to image hosted on R2 or elsewhere."
              />

              {featuredImage && (
                <div
                  style={{
                    marginTop: "8px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <img
                    src={featuredImage}
                    alt="Preview"
                    style={{ width: "100%", height: "auto", display: "block" }}
                    onError={e => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </Box>
          </DashboardCard>
        </Box>
      </DetailPageLayout.RightSidebar>
    </DetailPageLayout>
  );
};

BlogPostDetailsPage.displayName = "BlogPostDetailsPage";
export default BlogPostDetailsPage;
