import { PrivateForm } from "@/components/private-form";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "Private" };
}

export default function page() {
  return <PrivateForm />;
}
