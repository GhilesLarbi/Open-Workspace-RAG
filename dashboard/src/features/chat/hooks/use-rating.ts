import { useMutation } from '@tanstack/react-query'
import { chatApi } from '../api'

export function useRating(apiKey: string) {
  return useMutation({
    mutationFn: ({ sessionId, isHelpful }: { sessionId: string; isHelpful: boolean }) =>
      chatApi.rate(sessionId, isHelpful, apiKey),
  })
}
