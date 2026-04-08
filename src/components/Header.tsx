"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const headerStyle: React.CSSProperties = {
  width: "100%",
  borderBottom: "1px solid #e5e7eb",
  backgroundColor: "white",
};

const containerStyle: React.CSSProperties = {
  maxWidth: "900px",
  margin: "0 auto",
  padding: "16px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const logoStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 700,
  color: "#111827",
  textDecoration: "none",
};

const rightStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const userTextStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#374151",
  fontWeight: 600,
};

const outlineButtonStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  backgroundColor: "white",
  color: "#111827",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 500,
  textDecoration: "none",
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
};

export default function Header() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <Link href="/community" style={logoStyle}>
          Study Community
        </Link>

        <div style={rightStyle}>
          {isLoggedIn ? (
            <>
              <span style={userTextStyle}>{user?.username}님</span>
              <button
                type="button"
                onClick={handleLogout}
                style={outlineButtonStyle}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={outlineButtonStyle}>
                로그인
              </Link>
              <Link href="/signup" style={primaryButtonStyle}>
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}