export default function WorkspacesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-4xl">
        {children}
      </div>
    </div>
  );
}