import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "Welcome to andpaper!" },
  ];
}

export default function Home() {
  return <main className="flex flex-col justify-center items-center h-screen">
    <h1 className="font-semibold text-xl">Welcome to andpaper!</h1>

    <div className="mt-4">
      <p className="text-gray-600">This is a simple example of a home page layout.</p>
    </div>
  </main>;
}
