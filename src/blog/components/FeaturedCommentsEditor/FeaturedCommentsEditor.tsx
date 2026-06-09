import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
} from "@material-ui/core";
import { Star, Trash2 } from "lucide-react";

export interface Comment {
  author: string;
  avatar_url?: string;
  text: string;
  rating?: number;
  verified?: boolean;
  date?: string;
}

interface FeaturedCommentsEditorProps {
  comments: Comment[];
  onChange: (comments: Comment[]) => void;
}

export const FeaturedCommentsEditor = ({
  comments = [],
  onChange,
}: FeaturedCommentsEditorProps) => {
  const handleCommentChange = (index: number, updatedFields: Partial<Comment>) => {
    const updated = [...comments];

    updated[index] = { ...updated[index], ...updatedFields };
    onChange(updated);
  };

  const addComment = () => {
    const newComment: Comment = {
      author: "New Reviewer",
      text: "This is a great read!",
      rating: 5,
      verified: true,
      date: new Date().toISOString().split("T")[0],
    };

    onChange([...comments, newComment]);
  };

  const removeComment = (index: number) => {
    const updated = comments.filter((_, i) => i !== index);

    onChange(updated);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>Featured Comments</h3>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>
            Curate and manage static customer feedback that will be displayed on the blog page.
          </p>
        </div>
        <button
          type="button"
          onClick={addComment}
          style={{
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: 500,
            borderRadius: "6px",
            border: "1px solid #2563eb",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseOver={e => {
            e.currentTarget.style.backgroundColor = "#1d4ed8";
          }}
          onMouseOut={e => {
            e.currentTarget.style.backgroundColor = "#2563eb";
          }}
        >
          Add Comment
        </button>
      </div>

      {comments.length === 0 ? (
        <div
          style={{
            padding: "32px",
            border: "2px dashed #cbd5e1",
            borderRadius: "12px",
            textAlign: "center",
            color: "#64748b",
          }}
        >
          No featured comments added yet. Click &quot;Add Comment&quot; to begin.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
          {comments.map((comment, index) => (
            <Card
              key={index}
              style={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                overflow: "visible",
              }}
            >
              <CardContent
                style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                      flex: 1,
                    }}
                  >
                    <TextField
                      label="Author Name"
                      value={comment.author || ""}
                      onChange={e => handleCommentChange(index, { author: e.target.value })}
                      variant="outlined"
                      InputProps={{ style: { height: 56 } }}
                      fullWidth
                    />
                    <TextField
                      label="Publication Date"
                      type="date"
                      value={comment.date || ""}
                      onChange={e => handleCommentChange(index, { date: e.target.value })}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ style: { height: 56 } }}
                      fullWidth
                    />
                  </div>
                  <IconButton
                    size="small"
                    onClick={() => removeComment(index)}
                    style={{ color: "#ef4444", marginTop: "8px" }}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "center" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>
                        Rating:
                      </span>
                      <div style={{ display: "flex", gap: "2px" }}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            size={18}
                            style={{
                              cursor: "pointer",
                              fill: star <= (comment.rating || 0) ? "#eab308" : "none",
                              stroke: star <= (comment.rating || 0) ? "#eab308" : "#cbd5e1",
                            }}
                            onClick={() => handleCommentChange(index, { rating: star })}
                          />
                        ))}
                      </div>
                    </div>

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!comment.verified}
                          onChange={e => handleCommentChange(index, { verified: e.target.checked })}
                          color="primary"
                        />
                      }
                      label={
                        <span style={{ fontSize: "13px", fontWeight: 500 }}>Verified Purchase</span>
                      }
                    />
                  </div>

                  <TextField
                    label="Avatar URL (Optional)"
                    value={comment.avatar_url || ""}
                    onChange={e => handleCommentChange(index, { avatar_url: e.target.value })}
                    variant="outlined"
                    InputProps={{ style: { height: 56 } }}
                    fullWidth
                  />
                </div>

                <TextField
                  label="Comment Text"
                  value={comment.text || ""}
                  onChange={e => handleCommentChange(index, { text: e.target.value })}
                  variant="outlined"
                  multiline
                  minRows={2}
                  fullWidth
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
