import { PrivateForm } from "@/components/private-form";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "Private" };
}

export default function page() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[url('/images/landing-page-bg-light-xs.png')] bg-cover bg-fixed bg-center bg-no-repeat p-6 sm:bg-[url('/images/landing-page-bg-light-sm.png')] md:bg-[url('/images/landing-page-bg-light-md.png')] md:p-10 lg:bg-[url('/images/landing-page-bg-light-lg.png')] xl:bg-[url('/images/landing-page-bg-light-xl.png')] 2xl:bg-[url('/images/landing-page-bg-light-2xl.png')] dark:bg-[url('/images/landing-page-bg-dark-xs.png')] dark:sm:bg-[url('/images/landing-page-bg-dark-sm.png')] dark:md:bg-[url('/images/landing-page-bg-dark-md.png')] dark:lg:bg-[url('/images/landing-page-bg-dark-lg.png')] dark:xl:bg-[url('/images/landing-page-bg-dark-xl.png')] dark:2xl:bg-[url('/images/landing-page-bg-dark-2xl.png')]">
      <div className="w-full max-w-sm">
        <PrivateForm />
      </div>
    </main>
  );
}
