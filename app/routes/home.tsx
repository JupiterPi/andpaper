import Journal from "~/components/Journal"
import type { Route } from "./+types/home"
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import { SignIn } from "@clerk/clerk-react"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AndPaper" },
    { name: "description", content: "Welcome to andpaper!" },
  ]
}

export default function Home() {
  return <main className="flex flex-col justify-center items-center h-full pt-5">
    <Unauthenticated>
      <div className="w-full flex justify-center items-center">
        <SignIn appearance={{ theme: "simple" }} withSignUp={true} />
      </div>
    </Unauthenticated>
    <AuthLoading>
      <div className="w-full flex justify-center items-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    </AuthLoading>
    <Authenticated>
      <div className="w-full">
        <div className="mx-5">
          <Journal />
        </div>
      </div>
    </Authenticated>
  </main>
}