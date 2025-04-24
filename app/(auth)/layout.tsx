export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <div className="bg-muted/40 relative flex min-h-screen w-full items-center justify-center backdrop-blur-sm">
    //   <div className="z-10 w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-zinc-900">
    //     {children}
    //   </div>

    //   <div className="bg-background/60 absolute inset-0 -z-10 backdrop-blur-sm" />
    // </div>

    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
