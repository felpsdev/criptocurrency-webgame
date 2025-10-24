import LayoutHeader from "./components/layout_header";

export default function StepsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-fit flex flex-col gap-5 px-5">
        <LayoutHeader />
        {children}
      </div>
    </div>
  );
}
