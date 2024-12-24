import Image from "next/image"
import Link from "next/link"

import { ComplianceChecks } from "@/components/compliance-checks"
import { AIChat } from "@/components/ai-chat"

export const metadata = {
  title: "Supabase Compliance Checker",
  description: "Check your Supabase configuration for compliance",
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <main className="flex flex-col items-center justify-center w-full max-w-md text-center space-y-8">
        <section>
          <div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl whitespace-nowrap">
              Supabase Compliance Checker
          </h1>
            <p className="mx-auto mt-4 max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Ensure your Supabase configuration meets compliance standards with our easy-to-use checker.
            </p>
          </div>
        </section>
        <section className="w-full">
          <div className="w-full">
            <ComplianceChecks />
          </div>
        </section>
        <section className="w-full">
          <div className="w-full">
            <AIChat />
          </div>
        </section>
      </main>
    </div>
  );
}
