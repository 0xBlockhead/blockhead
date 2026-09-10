import { chmod, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

vi.mock('node:child_process', async importOriginal => {
	const actual = await importOriginal<typeof import('node:child_process')>()
	return { ...actual, spawn: vi.fn(actual.spawn) }
})

import { readRadicleRepository } from '$/sources/RadicleCli/Local/read.ts'
import { createRadicleCliRuntimeAdapter } from '$/sources/RadicleCli/Local/runtime.server.ts'
import { inspectRepositoryPayload } from '$/sources/RadicleCli/Local/queries.ts'

const repositoryId = 'rad:z3gqcJUoA1n9HaHKufZs5FCSGazv5D6Dt7Fnx1C4h2kKz'
const payload = JSON.stringify({ rid: repositoryId, visibility: 'public', git: { repositoryId: 'repo', objectFormat: 'sha256' } })
const originalPidFile = process.env.RADICLE_FAKE_PID
const pidFiles: string[] = []
let executable: string
let scratch: string

const waitForExit = async (pid: number) => {
	for (let attempt = 0; attempt < 40; attempt += 1) {
		try {
			process.kill(pid, 0)
			await new Promise(resolve => setTimeout(resolve, 25))
		} catch {
			return
		}
	}
	throw new Error(`child ${pid} survived`)
}

describe('Radicle CLI runtime adapter', () => {
	beforeAll(async () => {
		scratch = await mkdtemp(join(tmpdir(), 'radicle-runtime-adapter-'))
		executable = join(scratch, 'fake-radicle-cli.sh')
		await writeFile(executable, `#!/bin/sh
case "$1" in
  success) printf '%s' '${payload}' ;;
  inspect) if [ "$2" = "--payload" ]; then printf '%s' '${payload}'; fi ;;
	  stderr) printf '%*s' 200 '' >&2; exit 7 ;;
  overflow) printf '%*s' 5000 '' ;;
  timeout|cancel) trap '' TERM; sh -c 'trap "" TERM; while :; do sleep 1; done' & child=$!; printf '%s %s' "$$" "$child" > "$RADICLE_FAKE_PID"; wait "$child" ;;
  signal) kill -TERM $$ ;;
esac
`)
		await chmod(executable, 0o755)
	})
	afterEach(async () => {
		for (const pidFile of pidFiles.splice(0)) {
			try {
				const [parent] = (await readFile(pidFile, 'utf8')).trim().split(' ').map(Number)
				process.kill(-parent, 'SIGKILL')
				await waitForExit(parent)
			} catch {
				// The adapter normally owns termination; cleanup handles failed assertions.
			}
		}
		if (originalPidFile === undefined) delete process.env.RADICLE_FAKE_PID
		else process.env.RADICLE_FAKE_PID = originalPidFile
	})
	afterAll(async () => rm(scratch, { recursive: true, force: true }))

	it('returns byte-exact stdout through repository parsing', async () => {
		const adapter = createRadicleCliRuntimeAdapter({ executable })
		await expect(adapter.read({ command: 'rad', args: ['success'] })).resolves.toBe(payload)
		await expect(readRadicleRepository(repositoryId, adapter)).resolves.toEqual({
			rid: repositoryId,
			visibility: 'public',
			git: { repositoryId: 'repo', objectFormat: 'sha256' },
		})
	})

	it('rejects malformed repository IDs before constructing a command', () => {
		expect(() => inspectRepositoryPayload('not-a-rid')).toThrow('invalid repository ID')
	})

	it('sanitizes missing executable errors', async () => {
		await expect(createRadicleCliRuntimeAdapter({ executable: '/definitely/missing' }).read(inspectRepositoryPayload(repositoryId)))
			.rejects.toThrow('unable to start rad executable')
	})

	it('rejects pre-aborted reads without spawning the executable', async () => {
		const controller = new AbortController()
		const spawnSpy = vi.mocked(spawn)
		spawnSpy.mockClear()
		controller.abort()

		await expect(createRadicleCliRuntimeAdapter({ executable, signal: controller.signal })
			.read({ command: 'rad', args: ['success'] }))
			.rejects.toThrow('command cancelled')
		expect(spawnSpy).not.toHaveBeenCalled()
	})

	it('bounds stderr on nonzero exit', async () => {
		const error = await createRadicleCliRuntimeAdapter({ executable, maxOutputBytes: 256 })
			.read({ command: 'rad', args: ['stderr'] })
			.catch((cause: unknown) => cause)
		if (!(error instanceof Error)) throw new Error('expected Radicle CLI failure')
		expect(error.message).toMatch(/^RadicleCli_Local: rad command exited with status 7; stderr: +$/)
		expect(error.message.length).toBeLessThanOrEqual(320)
	})

	it('terminates and reports output overflow', async () => {
		await expect(createRadicleCliRuntimeAdapter({ executable, maxOutputBytes: 128 }).read({ command: 'rad', args: ['overflow'] }))
			.rejects.toThrow('output exceeded 128 bytes')
	})

	it('terminates on timeout and leaves no child', async () => {
		const pidFile = join(scratch, 'timeout.pid')
		pidFiles.push(pidFile)
		process.env.RADICLE_FAKE_PID = pidFile
		const promise = createRadicleCliRuntimeAdapter({ executable, timeoutMs: 50 }).read({ command: 'rad', args: ['timeout'] })
		await expect(promise).rejects.toThrow('timed out after 50ms')
		const [parent, child] = (await readFile(pidFile, 'utf8')).trim().split(' ').map(Number)
		await waitForExit(parent)
		await waitForExit(child)
	})

	it('terminates on cancellation and leaves no child', async () => {
		const controller = new AbortController()
		const pidFile = join(scratch, 'cancel.pid')
		pidFiles.push(pidFile)
		process.env.RADICLE_FAKE_PID = pidFile
		const promise = createRadicleCliRuntimeAdapter({ executable, signal: controller.signal }).read({ command: 'rad', args: ['cancel'] })
		await new Promise(resolve => setTimeout(resolve, 50))
		controller.abort()
		await expect(promise).rejects.toThrow('command cancelled')
		const [parent, child] = (await readFile(pidFile, 'utf8')).trim().split(' ').map(Number)
		await waitForExit(parent)
		await waitForExit(child)
	})

	it('reports external signal termination', async () => {
		await expect(createRadicleCliRuntimeAdapter({ executable }).read({ command: 'rad', args: ['signal'] }))
			.rejects.toThrow('terminated by SIGTERM')
	})
})
