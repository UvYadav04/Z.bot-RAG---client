import React from 'react'
import { cn } from '../../lib/utils'
import { Button } from '../../components/ui/button'
import { RefreshCcw } from 'lucide-react'

function Retry({
    message,
    retry,
    className,
}: {
    message?: string
    retry: () => void
    className?: string
}) {
    return (
        <div
            className={cn(
                "w-full flex flex-col items-center justify-between gap-3 rounded-xl border bg-background/60 backdrop-blur-md px-2 py-2 shadow-sm",
                className
            )}
        >
            {/* Left side */}
            <div className="flex flex-col">
                <span className="text-sm font-medium text-red-500">
                    Something went wrong
                </span>
                <span className="text-xs text-muted-foreground">
                    {message || "Failed to fetch data. Please try again."}
                </span>
            </div>

            {/* Right side */}
            <Button
                onClick={() => retry()}
                size="sm"
                variant="secondary"
                className="flex items-center gap-2 cursor-pointer"
            >
                <RefreshCcw className="w-4 h-4" />
                Retry
            </Button>
        </div>
    )
}

export default Retry