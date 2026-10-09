export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1140px] flex-1 px-4 py-10">
      <div className="max-w-2xl rounded-[0.35rem] border border-line bg-tile p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
