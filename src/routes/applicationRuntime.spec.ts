import {
	expect,
	test,
} from 'vitest'

import { applicationRuntimeWhenReady } from './applicationRuntime.ts'


test('mounts once after client readiness and destroys the mounted runtime once', async () => {
	let resolveClient: ((client: { id: string }) => void) | undefined
	const clientPromise = new Promise<{ id: string }>((resolve) => {
		resolveClient = resolve
	})
	let mountCount = 0
	let destroyCount = 0
	const runtime = applicationRuntimeWhenReady(clientPromise, (client) => {
		expect(client.id).toBe('canonical')
		mountCount += 1

		return {
			destroy: () => {
				destroyCount += 1
			},
		}
	})

	expect(mountCount).toBe(0)
	resolveClient?.({ id: 'canonical' })
	await runtime.ready
	expect(mountCount).toBe(1)

	runtime.destroy()
	runtime.destroy()
	expect(destroyCount).toBe(1)
})

test('does not mount after the layout is destroyed before client readiness', async () => {
	let resolveClient: ((client: { id: string }) => void) | undefined
	const clientPromise = new Promise<{ id: string }>((resolve) => {
		resolveClient = resolve
	})
	let mountCount = 0
	const runtime = applicationRuntimeWhenReady(clientPromise, () => {
		mountCount += 1

		return {
			destroy: () => {},
		}
	})

	runtime.destroy()
	resolveClient?.({ id: 'canonical' })
	await runtime.ready
	expect(mountCount).toBe(0)
})

test('propagates a late bootstrap rejection after teardown without mounting', async () => {
	let rejectClient: ((error: Error) => void) | undefined
	const clientPromise = new Promise<{ id: string }>((_, reject) => {
		rejectClient = reject
	})
	let mountCount = 0
	const runtime = applicationRuntimeWhenReady(clientPromise, () => {
		mountCount += 1

		return {
			destroy: () => {},
		}
	})
	const bootstrapFailure = new Error('resolver loading failed after navigation')

	runtime.destroy()
	rejectClient?.(bootstrapFailure)
	await expect(runtime.ready).rejects.toBe(bootstrapFailure)
	expect(mountCount).toBe(0)
})

test('propagates client and runtime failures through the one readiness promise', async () => {
	const clientFailure = new Error('database open failed')
	await expect(
		applicationRuntimeWhenReady(Promise.reject(clientFailure), () => ({
			destroy: () => {},
		})).ready
	).rejects.toBe(clientFailure)

	const runtimeFailure = new Error('wallet runtime failed')
	await expect(
		applicationRuntimeWhenReady(Promise.resolve({ id: 'canonical' }), () => {
			throw runtimeFailure
		}).ready
	).rejects.toBe(runtimeFailure)
})
