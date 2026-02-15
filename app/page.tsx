import Image from "next/image";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Hero2 from "./components/Hero2";

export default function Home() {
  return (
    <div className="">
      <Nav/>
      <Hero/>
      <Hero2/>
    </div>
  );
}
