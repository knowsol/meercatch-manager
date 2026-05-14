"use client";
import { useState, useEffect, CSSProperties } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLogin } from "../../lib/api/hooks/useAuth";
import apiClient from "../../lib/api/client";
import { ENDPOINTS } from "../../lib/api/endpoints";
import type { UserRole, Menu, MyMenuResponse } from "@/types";

const SESSION_EXPIRED_KEY = "meercatch_session_expired";
const LOGIN_MESSAGE_KEY = "login_message";

const BG: CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%)",
};

const CARD_STYLE: CSSProperties = {
  width: 380,
  background: "#fff",
  borderRadius: 20,
  boxShadow: "0 8px 32px rgba(0,0,0,.1)",
  padding: "40px 36px",
};

function Logo() {
  return (
    <div style={{ textAlign: "center", marginBottom: 28 }}>
      <div
        style={{
          fontSize: 30,
          fontWeight: 800,
          color: "#1e293b",
          letterSpacing: -1,
          marginBottom: 4,
        }}
      >
        MeerCat.ch Manager
      </div>
      <div style={{ fontSize: 13, color: "#64748b" }}>
        관리자 포털에 로그인하세요
      </div>
    </div>
  );
}

interface RoleToggleProps {
  value: string;
  onChange: (role: string) => void;
}

function RoleToggle({ value, onChange }: RoleToggleProps) {
  const roles = [
    { key: "direct", label: "직접 관리" },
    { key: "manager", label: "매니저 관리" },
  ];
  return (
    <div
      style={{
        display: "flex",
        background: "#f1f5f9",
        borderRadius: 10,
        padding: 3,
        marginBottom: 20,
        gap: 2,
      }}
    >
      {roles.map((r) => (
        <button
          key={r.key}
          onClick={() => onChange(r.key)}
          style={{
            flex: 1,
            padding: "8px 0",
            fontSize: 13,
            fontWeight: 600,
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            background: value === r.key ? "#fff" : "transparent",
            color: value === r.key ? "#1e293b" : "#64748b",
            boxShadow: value === r.key ? "0 1px 4px rgba(0,0,0,.1)" : "none",
            transition: "all .15s",
          }}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

interface InputFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  error?: string;
  disabled?: boolean;
}

function InputField({
  type,
  placeholder,
  value,
  onChange,
  onEnter,
  error,
  disabled,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
        disabled={disabled}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "11px 14px",
          border: error
            ? "1.5px solid #ef4444"
            : focused
              ? "1.5px solid #3b82f6"
              : "1.5px solid #e2e8f0",
          borderRadius: 10,
          fontSize: 14,
          outline: "none",
          background: error ? "#fff5f5" : disabled ? "#f8fafc" : "#fff",
          transition: "border-color .15s",
          opacity: disabled ? 0.7 : 1,
        }}
      />
      {error && (
        <div
          style={{
            color: "#ef4444",
            fontSize: 12,
            marginTop: 4,
            paddingLeft: 2,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default function Login() {
  const { login } = useAuth();
  const loginMutation = useLogin();

  const [loginRole, setLoginRole] = useState("direct");
  const [userId, setUserId] = useState("superadmin");
  const [password, setPassword] = useState("soft0301");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sessionMessage, setSessionMessage] = useState<string | null>(null);

  // 세션 만료 메시지 표시
  useEffect(() => {
    const message = sessionStorage.getItem(LOGIN_MESSAGE_KEY);
    if (message) {
      setSessionMessage(message);
      sessionStorage.removeItem(LOGIN_MESSAGE_KEY);
      sessionStorage.removeItem(SESSION_EXPIRED_KEY);

      // 5초 후 메시지 자동 제거
      const timer = setTimeout(() => setSessionMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleRoleChange = (role: string) => {
    setLoginRole(role);
    setErrors({});
  };

  async function handleLogin() {
    setErrors({});

    if (!userId.trim()) {
      setErrors({ userId: "아이디를 입력해주세요." });
      return;
    }
    if (!password.trim()) {
      setErrors({ password: "비밀번호를 입력해주세요." });
      return;
    }

    try {
      const response = await loginMutation.mutateAsync({
        userId: userId.trim(),
        password: password,
      });

      const accountInfo = response.data.accountInfo;
      const permissionId = accountInfo.permissionInfo?.permissionId ?? 1;

      // 로그인 성공 후 메뉴 조회
      let menus: Menu[] = [];
      try {
        const menuResponse = await apiClient.post<MyMenuResponse>(
          ENDPOINTS.MENU.MY,
        );
        menus = menuResponse.data.data ?? [];
      } catch {
        console.warn("메뉴 조회 실패, 기본 메뉴 사용");
      }

      login(
        loginRole as "manager" | "direct",
        accountInfo.name,
        accountInfo.role as UserRole,
        String(accountInfo.accountId),
        permissionId,
        menus,
      );
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (axiosError.response?.status === 401) {
        setErrors({ password: "아이디 또는 비밀번호가 올바르지 않습니다." });
      } else if (axiosError.response?.status === 403) {
        setErrors({ userId: "비활성화된 계정입니다. 관리자에게 문의하세요." });
      } else {
        setErrors({
          password: "로그인에 실패했습니다. 잠시 후 다시 시도해주세요.",
        });
      }
    }
  }

  const isLoading = loginMutation.isPending;

  return (
    <div style={BG}>
      <div style={CARD_STYLE}>
        <Logo />

        {/* 세션 만료 알림 메시지 */}
        {sessionMessage && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dc2626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span style={{ color: "#dc2626", fontSize: 13, fontWeight: 500 }}>
              {sessionMessage}
            </span>
          </div>
        )}

        <RoleToggle value={loginRole} onChange={handleRoleChange} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <InputField
            type="text"
            placeholder="superadmin"
            value={userId}
            onChange={setUserId}
            onEnter={handleLogin}
            error={errors.userId}
            disabled={isLoading}
          />
          <InputField
            type="password"
            placeholder="test"
            value={password}
            onChange={setPassword}
            onEnter={handleLogin}
            error={errors.password}
            disabled={isLoading}
          />
          <button
            onClick={handleLogin}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: 12,
              marginTop: 2,
              background: isLoading ? "#94a3b8" : "var(--ac)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background .15s",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.filter = "brightness(0.88)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "none";
            }}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 12,
            color: "#94a3b8",
          }}
        >
          © {new Date().getFullYear()} MeerCat.ch
        </div>
      </div>
    </div>
  );
}
