export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`header, footer, [class*="cookie"], [data-sonner-toaster] { display: none !important; }`}</style>
      {children}
    </>
  );
}
