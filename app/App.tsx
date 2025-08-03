export default function App({ children }: { children: React.ReactNode }) {
  return <>
    {/* navbar */}
    <div className="border-b-1 border-black px-4 py-3 flex gap-3 items-center">
        <TitleWithLogo />
        <div className="flex-1"></div>
        <div className="">(login)</div>
    </div>

    {children}
  </>
}

function TitleWithLogo() {
  return (
    <h1 className="font-semibold text-2xl flex items-center gap-2">
      <img src="/andpaper-icon-dark.png" className="h-[25px] relative -top-[0px]" />
      <span className="select-none">AndPaper</span>
    </h1>
  )
}