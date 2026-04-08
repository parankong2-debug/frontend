import Link from "next/link";

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f7f7fb",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          textAlign: "center",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <h1 style={{ marginBottom: "12px" }}>커뮤니티 게시판</h1>
        <p style={{ marginBottom: "20px", color: "#666" }}>
          3주차 과제 - API 연결하기
        </p>

        <Link href="/community">
          <button
            style={{
              padding: "12px 18px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#2563eb",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            커뮤니티 바로가기
          </button>
        </Link>
      </div>
    </div>
  );
}