import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "Information" };
}

export default function page() {
  return <div>page</div>;
}
