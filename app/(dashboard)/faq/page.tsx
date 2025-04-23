import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "FAQ" };
}

export default function page() {
  return <div>page</div>;
}
