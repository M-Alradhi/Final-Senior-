"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Error occurred:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <AlertCircle className="h-16 w-16 text-red-600" />
          </div>
          <CardTitle className="text-2xl">t("somethingWentWrong")</CardTitle>
          <CardDescription className="text-base mt-2">t("pleaseTryAgain")</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error.message && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800 text-right">
              <p className="font-semibold mb-1">t("errorDetails")</p>
              <p className="text-xs">{error.message}</p>
            </div>
          )}
          <Button onClick={reset} size="lg" className="w-full">
            <RefreshCw className="ml-2 h-4 w-4" />
              t("tryAgain")
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
