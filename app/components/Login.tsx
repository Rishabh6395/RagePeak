"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { authClient } from "@/app/lib/auth-client";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    await authClient.signIn.email(
      { email, password },
      {
        onSuccess: () => {
          login();        // sets sessionStorage + updates user state
          router.push("/");
        },
        onError: (ctx) => {
          alert(`Error: ${ctx.error.message}`);
        },
      }
    );
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
}