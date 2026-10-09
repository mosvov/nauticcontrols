export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[1140px] flex-1 flex-col px-4 py-10">
      {children}
    </div>
  );
}
