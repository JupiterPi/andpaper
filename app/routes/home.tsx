import Journal from "~/components/Journal";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AndPaper" },
    { name: "description", content: "Welcome to andpaper!" },
  ];
}

export default function Home() {
  return <main className="flex flex-col justify-center items-center h-screen">
    <TitleWithLogo />
    <p className="mt-3">Journal your D&D sessions with ease.</p>

    <br></br><br></br>

    <div className="w-full">
      <div className="mx-5">
        <Journal />
      </div>
    </div>
  </main>;
}

function TitleWithLogo() {
  return (
    <h1 className="font-semibold text-2xl flex items-center gap-2">
      <img src="/andpaper-icon-dark.png" className="h-[25px] relative -top-[0px]" />
      <span className="select-none">AndPaper</span>
    </h1>
  )
}