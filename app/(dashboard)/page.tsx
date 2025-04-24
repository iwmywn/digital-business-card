import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "Home" };
}

export default function Home() {
  return <div className="h-500 bg-red-600/30"></div>;
}
