import Hero from "./components/Hero";
import Hero2 from "./components/Hero2";
import { auth } from "./lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  console.log("session: ",session)

  if (!session) {
    redirect("/api/auth/signup");
  }

  return (
    <div>
      <Hero />
      <Hero2 />
    </div>
  );
}