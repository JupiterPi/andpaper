import Journal from "~/components/Journal";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AndPaper" },
    { name: "description", content: "Welcome to andpaper!" },
  ];
}

export default function Home() {
  return <main className="flex flex-col justify-center items-center h-full pt-5">
    <div className="w-full">
      <div className="mx-5">
        <Journal />
      </div>
    </div>
  </main>;
}