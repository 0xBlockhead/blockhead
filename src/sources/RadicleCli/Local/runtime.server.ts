import { spawn, type ChildProcess } from 'node:child_process'

import type { RadicleCliCommand, RadicleCliPlatformAdapter } from '$/sources/RadicleCli/Local/types.ts'

const defaultExecutable = 'rad'
const defaultTimeoutMs = 10_000
const defaultMaxOutputBytes = 1024 * 1024
const terminationGraceMs = 100

type RuntimeOptions = {
	executable?: string
	timeoutMs?: number
	maxOutputBytes?: number
	signal?: AbortSignal
}

const boundedText = (value: Buffer, limit: number) => value.subarray(0, limit).toString('utf8')

const terminate = (child: ChildProcess) => {
	if (child.exitCode !== null || child.signalCode !== null) return
	if (process.platform !== 'win32' && child.pid !== undefined) {
		try {
			process.kill(-child.pid, 'SIGTERM')
			return
		} catch {
			// The child may have exited between the state check and group signal.
		}
	}
	child.kill('SIGTERM')
}

const forceTerminate = (child: ChildProcess) => {
	if (process.platform !== 'win32' && child.pid !== undefined) {
		try {
			process.kill(-child.pid, 'SIGKILL')
			return
		} catch {
			// The child may have exited between the state check and group signal.
		}
	}
	if (child.exitCode !== null || child.signalCode !== null) return
	child.kill('SIGKILL')
}

export const createRadicleCliRuntimeAdapter = (
	options: RuntimeOptions = {},
): RadicleCliPlatformAdapter => {
	const executable = options.executable ?? defaultExecutable
	const timeoutMs = options.timeoutMs ?? defaultTimeoutMs
	const maxOutputBytes = options.maxOutputBytes ?? defaultMaxOutputBytes

	return {
		read: command => new Promise<string>((resolve, reject) => {
			if (options.signal?.aborted) {
				reject(new Error('RadicleCli_Local: rad command cancelled'))
				return
			}

			let child: ChildProcess
			try {
				child = spawn(executable, command.args, { detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe'] })
			} catch {
				reject(new Error('RadicleCli_Local: unable to start rad executable'))
				return
			}

			let settled = false
			let timedOut = false
			let cancelled = false
			let overflowed = false
			let stdout = Buffer.alloc(0)
			let stderr = Buffer.alloc(0)
			let escalationTimer: ReturnType<typeof setTimeout> | undefined
			const scheduleEscalation = () => {
				if (escalationTimer !== undefined) return
				escalationTimer = setTimeout(() => forceTerminate(child), terminationGraceMs)
			}
			const timer = setTimeout(() => {
				timedOut = true
				terminate(child)
				scheduleEscalation()
			}, timeoutMs)

			const finish = (error?: Error, value?: string) => {
				if (settled) return
				settled = true
				clearTimeout(timer)
				options.signal?.removeEventListener('abort', onAbort)
				child.stdout?.removeAllListeners()
				child.stderr?.removeAllListeners()
				child.removeAllListeners()
				if (error) reject(error)
				else resolve(value ?? '')
			}

			const onAbort = () => {
				cancelled = true
				terminate(child)
				scheduleEscalation()
			}
			if (options.signal?.aborted) onAbort()
			else options.signal?.addEventListener('abort', onAbort, { once: true })

			const capture = (stream: 'stdout' | 'stderr', chunk: Buffer) => {
				if (settled || overflowed) return
				const nextSize = stdout.length + stderr.length + chunk.length
				if (nextSize > maxOutputBytes) {
					overflowed = true
					terminate(child)
					scheduleEscalation()
					return
				}
				if (stream === 'stdout') stdout = Buffer.concat([stdout, chunk])
				else stderr = Buffer.concat([stderr, chunk])
			}
			child.stdout?.on('data', (chunk: Buffer) => capture('stdout', chunk))
			child.stderr?.on('data', (chunk: Buffer) => capture('stderr', chunk))
			child.once('error', () => finish(new Error('RadicleCli_Local: unable to start rad executable')))
			child.once('close', (code, signal) => {
				if (cancelled) return finish(new Error('RadicleCli_Local: rad command cancelled'))
				if (timedOut) return finish(new Error(`RadicleCli_Local: rad command timed out after ${timeoutMs}ms`))
				if (overflowed) return finish(new Error(`RadicleCli_Local: rad command output exceeded ${maxOutputBytes} bytes`))
				if (signal) return finish(new Error(`RadicleCli_Local: rad command terminated by ${signal}`))
				if (code !== 0) return finish(new Error(`RadicleCli_Local: rad command exited with status ${code}; stderr: ${boundedText(stderr, maxOutputBytes)}`))
				finish(undefined, stdout.toString('utf8'))
			})
		}),
	}
}
