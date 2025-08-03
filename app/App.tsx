import { UserButton } from "@clerk/clerk-react"
import { DarkModeToggle } from "./components/dark-mode-toggle"
import { useTheme } from "./components/theme-provider"

export default function App({ children }: { children: React.ReactNode }) {
  return <>
    {/* navbar */}
    <div className="border-b shadow-sm px-4 py-3 flex gap-3 items-center">
        <TitleWithLogo />
        <div className="flex-1"></div>
        <DarkModeToggle />
        <div className="rounded-full border-1 size-[30px] flex justify-center items-center"><UserButton appearance={{ theme: "simple" }} /></div>
    </div>

    {children}
  </>
}

function TitleWithLogo() {
  const isDarkTheme = useTheme().theme === "dark"

  return (
    <h1 className="font-semibold text-2xl flex items-center gap-2">
      <img src={isDarkTheme ? "/andpaper-icon.png" : "/andpaper-icon-dark.png"} className="h-[25px] relative -top-[0px]" />
      <span className="select-none">AndPaper</span>
    </h1>
  )
}