type Comment = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
};

type CommentItemProps = {
  comment: Comment;
  onDelete?: () => void;
};

export default function CommentItem({
  comment,
  onDelete,
}: CommentItemProps) {
  return (
    <div style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
      <p>
        <strong>{comment.author}</strong> / {comment.createdAt}
      </p>
      <p>{comment.content}</p>

      {onDelete && <button onClick={onDelete}>삭제</button>}
    </div>
  );
}