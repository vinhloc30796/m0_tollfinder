import { createFileRoute, Link } from '@tanstack/react-router'
import { IconExternalLink, IconCode } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <h1>about m0_tollfinder</h1>
        <p className="text-muted-foreground mt-2">
          m0_tollfinder is a read-only bridge fee estimator for the M0 stack. it queries on-chain
          contracts via ethers v6 to estimate msg.value and preview calldata for common routes.
        </p>

        <div className="mt-6 p-4 border-l-4 border-muted bg-muted/20 rounded-r">
          <p className="text-sm text-muted-foreground m-0">
            <strong>disclaimer:</strong> m0_tollfinder is an independent project and is <strong>NOT</strong> affiliated with m0.
            contract addresses should be verified against official docs.
          </p>
        </div>
      </div>

      <div className="space-y-6 not-prose">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconExternalLink className="size-5 text-primary" />
              <CardTitle>m0 docs</CardTitle>
            </div>
            <CardDescription>
              documentation and references
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              contracts, abis, and integration notes.
            </p>
            <Button asChild className="w-full" variant="default">
              <a href="https://docs.m0.org" target="_blank" rel="noopener noreferrer">
                open docs
                <IconExternalLink className="size-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconCode className="size-5 text-primary" />
              <CardTitle>m0_tollfinder</CardTitle>
            </div>
            <CardDescription>
              estimator details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-sm space-y-2">
                <p className="font-medium">what we build:</p>
                <ul className="text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>read-only contract queries</li>
                  <li>cli + minimal web ui</li>
                  <li>feature-flag/canary awareness</li>
                </ul>
              </div>
              <div className="text-sm space-y-2">
                <p className="font-medium">principles:</p>
                <ul className="text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>performance-first, measurable</li>
                  <li>clarity &gt; cleverness</li>
                  <li>typesafe, great dx</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/">home</Link>
              </Button>
              <Button asChild variant="ghost" className="flex-1">
                <a href="mailto:vinhloc30796@gmail.com?subject=m0_tollfinder%20Feedback">
                  feedback
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
