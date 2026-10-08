import * as React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        className={cn("pr-9", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute inset-y-0 right-0.5 my-auto text-muted-foreground hover:text-foreground"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
      >
        {visible ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  )
}

export { PasswordInput }
