import { toast } from 'sonner'
import { handleError } from '../lib/errors/errorHandler'

export interface ErrorToastOptions {
  duration?: number
  context?: string
}

export function showErrorToast(error: unknown, options?: ErrorToastOptions): void {
  const userMessage = handleError(error, options?.context)

  toast.error(userMessage, {
    duration: options?.duration ?? 4000,
    className: 'glass-panel border-red-500/50',
    style: {
      background: 'rgba(239, 68, 68, 0.1)',
      borderColor: 'rgba(239, 68, 68, 0.5)',
      color: 'white'
    }
  })
}

export function showSuccessToast(message: string, duration?: number): void {
  toast.success(message, {
    duration: duration ?? 3000,
    className: 'glass-panel border-green-500/50',
    style: {
      background: 'rgba(34, 197, 94, 0.1)',
      borderColor: 'rgba(34, 197, 94, 0.5)',
      color: 'white'
    }
  })
}

export function showInfoToast(message: string, duration?: number): void {
  toast.info(message, {
    duration: duration ?? 3000,
    className: 'glass-panel border-blue-500/50',
    style: {
      background: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 0.5)',
      color: 'white'
    }
  })
}

export function showWarningToast(message: string, duration?: number): void {
  toast.warning(message, {
    duration: duration ?? 3000,
    className: 'glass-panel border-yellow-500/50',
    style: {
      background: 'rgba(234, 179, 8, 0.1)',
      borderColor: 'rgba(234, 179, 8, 0.5)',
      color: 'white'
    }
  })
}

