"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#f5f7fb",
  padding: "40px 20px",
};

const containerStyle: React.CSSProperties = {
  maxWidth: "480px",
  margin: "0 auto",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: "16px",
  padding: "28px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
  border: "1px solid #e5e7eb",
};

const titleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "8px",
  fontSize: "32px",
  fontWeight: 700,
  color: "#111827",
};

const subtitleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "24px",
  color: "#6b7280",
  fontSize: "15px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  color: "#374151",
  fontSize: "14px",
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginBottom: "18px",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  backgroundColor: "#ffffff",
  boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 18px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
};

const errorStyle: React.CSSProperties = {
  marginBottom: "16px",
  padding: "12px 14px",
  borderRadius: "10px",
  backgroundColor: "#fef2f2",
  color: "#dc2626",
  fontSize: "14px",
  border: "1px solid #fecaca",
};

const footerTextStyle: React.CSSProperties = {
  marginTop: "18px",
  textAlign: "center",
  fontSize: "14px",
  color: "#6b7280",
};

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const data = await login({
        email,
        password,
      });

      setAuth(data.access_token, data.user);
      router.push("/community");
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.detail?.error ||
          "이메일 또는 비밀번호가 올바르지 않습니다."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>로그인</h1>
          <p style={subtitleStyle}>이메일과 비밀번호를 입력해 로그인하세요.</p>

          <label style={labelStyle}>이메일</label>
          <input
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          {error && <div style={errorStyle}>{error}</div>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            style={buttonStyle}
          >
            {submitting ? "로그인 중..." : "로그인"}
          </button>

          <p style={footerTextStyle}>
            계정이 없으신가요? <Link href="/signup">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  );
}