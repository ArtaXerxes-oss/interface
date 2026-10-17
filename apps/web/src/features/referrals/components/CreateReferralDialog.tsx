import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { LoadingButton } from "@workspace/ui/components/loading-button"
import { Input } from "@workspace/ui/components/input"
import { Text } from "@workspace/ui/components/text"
import { validateReferralCode } from "../lib/referrals"
import { useCreateReferralCodeMutation } from "../hooks/useCreateReferralCodeMutation"

export type CreateReferralDialogProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateReferralDialog({
  isOpen,
  onOpenChange,
}: CreateReferralDialogProps) {
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const mutation = useCreateReferralCodeMutation()

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value
    setCode(newCode)
    if (newCode.length > 0) {
      setError(validateReferralCode(newCode))
    } else {
      setError(null)
    }
  }

  const handleSubmit = async () => {
    const validationError = validateReferralCode(code)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      await mutation.mutateAsync(code)
      onOpenChange(false)
      setCode("")
      setError(null)
    } catch (err) {
      // Error handled by submitTx
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Referral Code</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <Text
              size="base"
              weight="medium"
              render={<label htmlFor="create-referral-code" />}
              className="mb-2 block"
            >
              Referral Code
            </Text>
            <Input
              id="create-referral-code"
              placeholder="e.g. MY_CUSTOM_CODE"
              value={code}
              onChange={handleCodeChange}
              aria-invalid={error ? true : undefined}
              aria-describedby="create-referral-code-hint"
            />
            <Text
              id="create-referral-code-hint"
              size="xs"
              tone={error ? "danger" : "muted"}
              className="mt-1.5"
            >
              {error ?? "Minimum 3 characters. Only letters, numbers, and underscores allowed."}
            </Text>
          </div>

          <LoadingButton
            className="w-full"
            isLoading={mutation.isPending}
            loadingText="Creating..."
            disabled={!!error || code.length === 0}
            onClick={() => void handleSubmit()}
          >
            Create Code
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}
