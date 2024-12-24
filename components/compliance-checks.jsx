"use client";
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle, XCircle } from 'lucide-react'

export function ComplianceChecks() {
  const [apiKey, setApiKey] = useState("")
  const [projectId, setProjectId] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const runChecks = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/run-checks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey, projectId, accessToken }),
      })
      const data = await response.json()
      setResults(data.results)
    } catch (error) {
      console.error("Error running checks:", error)
      setResults([
        {
          name: "Compliance Checks",
          status: "fail",
          details: [`Failed to run compliance checks: ${error instanceof Error ? error.message : 'Unknown error'}`],
        },
      ])
    }
    setLoading(false)
  }

  return (
    (<Card className="w-full">
      <CardHeader>
        <CardTitle>Compliance Checks</CardTitle>
        <CardDescription>Enter your Supabase API key, project ID and Supabase Access Token run compliance checks.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="apiKey">Supabase API Key</Label>
            <Input
              id="apiKey"
              placeholder="Enter your Supabase API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="projectId">Project ID</Label>
            <Input
              id="projectId"
              placeholder="Enter your Supabase project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)} />
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="projectId">Access Token</Label>
            <Input
              id="accessToken"
              placeholder="Enter your Supabase access token"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)} />
          </div>

        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={runChecks} disabled={loading}>
          {loading ? "Running Checks..." : "Run Compliance Checks"}
        </Button>
      </CardFooter>
      {results.length > 0 && (
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {results.map((result, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>
                  <div className="flex items-center space-x-2">
                    {result.status === "pass" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span>{result.name}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-6">
                    {result.details.map((detail, detailIndex) => (
                      <li key={detailIndex}>{detail}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      )}
    </Card>)
  );
}

