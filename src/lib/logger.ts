type LogLevel = 'info' | 'warn' | 'error' | 'security'

export function log(level: LogLevel, event: string, details?: Record<string, unknown>, ip?: string) {
  const entry = { level, event, ip, details, timestamp: new Date().toISOString() }
  if (level === 'error' || level === 'security') {
    console.error(JSON.stringify(entry))
  } else {
    console.log(JSON.stringify(entry))
  }
}

export function logSecurity(event: string, ip: string, details?: Record<string, unknown>) {
  log('security', event, details, ip)
}

export function logError(event: string, error: unknown, details?: Record<string, unknown>) {
  log('error', event, { ...details, error: String(error) })
}
