import assert from 'node:assert/strict'
import test from 'node:test'

import { applicationRuntimeWhenReady } from '../../src/routes/applicationRuntime.ts'


test('mounts once after client readiness and destroys the mounted runtime once', async () => {
	let resolveClient: ((client: { id: string }) => void) | undefined
	const clientPromise = new Promise<{ id: string }>((resolve) => {
		resolveClient = resolve
	})
	let mountCount = 0
	let destroyCount = 0
	const runtime = applicationRuntimeWhenReady(clientPromise, (client) => {
		assert.equal(client.id, 'canonical')
		mountCount += 1

		return {
			destroy: () => {
				destroyCount += 1
			},
		}
	})

	assert.equal(mountCount, 0)
	resolveClient?.({ id: 'canonical' })
	await runtime.ready
	assert.equal(mountCount, 1)

	runtime.destroy()
	runtime.destroy()
	assert.equal(destroyCount, 1)
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
	assert.equal(mountCount, 0)
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
	await assert.rejects(runtime.ready, bootstrapFailure)
	assert.equal(mountCount, 0)
})

test('propagates client and runtime failures through the one readiness promise', async () => {
	const clientFailure = new Error('database open failed')
	await assert.rejects(
		applicationRuntimeWhenReady(Promise.reject(clientFailure), () => ({
			destroy: () => {},
		})).ready,
		clientFailure
	)

	const runtimeFailure = new Error('wallet runtime failed')
	await assert.rejects(
		applicationRuntimeWhenReady(Promise.resolve({ id: 'canonical' }), () => {
			throw runtimeFailure
		}).ready,
		runtimeFailure
	)
})
