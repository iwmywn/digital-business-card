export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[url('/images/page-bg-light.png')] bg-cover bg-fixed bg-center bg-no-repeat p-6 md:p-10 dark:bg-[url('/images/page-bg-dark.png')]">
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}
