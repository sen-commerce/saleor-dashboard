import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import { ListPageLayout } from "@dashboard/components/Layouts";
import useNavigator from "@dashboard/hooks/useNavigator";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Box, Button } from "@saleor/macaw-ui-next";
import { Edit, FileText, Globe, Trash2 } from "lucide-react";

export interface BlogPostNode {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  isPublished: boolean;
  publishedAt?: string | null;
  readingTimeMinutes?: number;
  author?: {
    id: string;
    name: string;
  } | null;
  category?: {
    id: string;
    name: string;
  } | null;
}

interface BlogPostListPageProps {
  posts: BlogPostNode[];
  loading: boolean;
  onPostCreate: () => void;
  onPostDelete: (id: string) => void;
}

export const BlogPostListPage = ({
  posts = [],
  loading,
  onPostCreate,
  onPostDelete,
}: BlogPostListPageProps) => {
  const navigate = useNavigator();

  const handleRowClick = (id: string) => {
    navigate(`/blog/${id}`);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) {
      return "-";
    }

    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <ListPageLayout>
      <TopNav title="Blog Posts" withoutBorder>
        <Button onClick={onPostCreate} variant="primary">
          Create Blog Post
        </Button>
      </TopNav>

      <Box paddingX={6} display="flex" flexDirection="column" gap={4}>
        <DashboardCard>
          <TableContainer component={Paper} elevation={0} style={{ background: "transparent" }}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#f8fafc" }}>
                  <TableCell style={{ fontWeight: 600, color: "#475569" }}>Title</TableCell>
                  <TableCell style={{ fontWeight: 600, color: "#475569" }}>Author</TableCell>
                  <TableCell style={{ fontWeight: 600, color: "#475569" }}>Category</TableCell>
                  <TableCell style={{ fontWeight: 600, color: "#475569" }}>Created Date</TableCell>
                  <TableCell style={{ fontWeight: 600, color: "#475569" }}>Status</TableCell>
                  <TableCell align="right" style={{ fontWeight: 600, color: "#475569" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      style={{ padding: "40px", color: "#64748b" }}
                    >
                      Loading blog posts...
                    </TableCell>
                  </TableRow>
                ) : posts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      style={{ padding: "40px", color: "#64748b" }}
                    >
                      No blog posts found. Click &quot;Create Blog Post&quot; to write your first
                      article.
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map(post => (
                    <TableRow
                      key={post.id}
                      hover
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRowClick(post.id)}
                    >
                      <TableCell style={{ fontWeight: 500 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontSize: "14px", color: "#0f172a" }}>{post.title}</span>
                          <span style={{ fontSize: "12px", color: "#64748b" }}>/{post.slug}</span>
                        </div>
                      </TableCell>
                      <TableCell>{post.author?.name || "-"}</TableCell>
                      <TableCell>
                        {post.category ? (
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              backgroundColor: "#f1f5f9",
                              fontSize: "12px",
                              color: "#334155",
                            }}
                          >
                            {post.category.name}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{formatDate(post.createdAt)}</TableCell>
                      <TableCell>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: 500,
                            backgroundColor: post.isPublished ? "#dcfce7" : "#f1f5f9",
                            color: post.isPublished ? "#15803d" : "#475569",
                          }}
                        >
                          {post.isPublished ? (
                            <>
                              <Globe size={12} /> Published
                            </>
                          ) : (
                            <>
                              <FileText size={12} /> Draft
                            </>
                          )}
                        </span>
                      </TableCell>
                      <TableCell align="right" onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                          <IconButton size="small" onClick={() => handleRowClick(post.id)}>
                            <Edit size={16} style={{ color: "#2563eb" }} />
                          </IconButton>
                          <IconButton size="small" onClick={() => onPostDelete(post.id)}>
                            <Trash2 size={16} style={{ color: "#ef4444" }} />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DashboardCard>
      </Box>
    </ListPageLayout>
  );
};

BlogPostListPage.displayName = "BlogPostListPage";
export default BlogPostListPage;
