import {
	expect,
	it,
	vi,
} from 'vitest'

import { openApplicationClientLifecycle } from './applicationClientRuntime.ts'

it('registers exactly the client produced after successful bootstrap', async () => {
	const client = { destroy: vi.fn() }
	const register = vi.fn()
	const runtime = await openApplicationClientLifecycle({
		persistenceRuntime: { close: vi.fn() },
		createClient: async () => client,
		register,
		unregister: vi.fn(),
	})

	expect(runtime.client).toBe(client)
	expect(register).toHaveBeenCalledExactlyOnceWith(client)
})

it('closes persistence and preserves the bootstrap failure without registering', async () => {
	const failure = new Error('native persistence unavailable')
	const close = vi.fn(async () => {})
	const register = vi.fn()

	await expect(openApplicationClientLifecycle({
		persistenceRuntime: { close },
		createClient: async () => { throw failure },
		register,
		unregister: vi.fn(),
	})).rejects.toBe(failure)
	expect(register).not.toHaveBeenCalled()
	expect(close).toHaveBeenCalledOnce()
})

it('destroys the client and closes persistence when registration fails', async () => {
	const failure = new Error('registry unavailable')
	const client = { destroy: vi.fn() }
	const close = vi.fn(async () => {})

	await expect(openApplicationClientLifecycle({
		persistenceRuntime: { close },
		createClient: async () => client,
		register: () => { throw failure },
		unregister: vi.fn(),
	})).rejects.toBe(failure)
	expect(client.destroy).toHaveBeenCalledOnce()
	expect(close).toHaveBeenCalledOnce()
})

it('unregisters, destroys the client, and closes persistence exactly once', async () => {
	const order: string[] = []
	const client = { destroy: vi.fn(() => order.push('client')) }
	const unregister = vi.fn(() => order.push('unregister'))
	const close = vi.fn(async () => { order.push('persistence') })
	const runtime = await openApplicationClientLifecycle({
		persistenceRuntime: { close },
		createClient: async () => client,
		register: vi.fn(),
		unregister,
	})

	await runtime.destroy()
	await runtime.destroy()

	expect(order).toEqual(['unregister', 'client', 'persistence'])
	expect(unregister).toHaveBeenCalledOnce()
	expect(client.destroy).toHaveBeenCalledOnce()
	expect(close).toHaveBeenCalledOnce()
})

it('attempts every owned close when unregister fails', async () => {
	const failure = new Error('registry teardown failed')
	const client = { destroy: vi.fn() }
	const close = vi.fn(async () => {})
	const runtime = await openApplicationClientLifecycle({
		persistenceRuntime: { close },
		createClient: async () => client,
		register: vi.fn(),
		unregister: () => { throw failure },
	})

	await expect(runtime.destroy()).rejects.toMatchObject({
		errors: [failure],
	})
	expect(client.destroy).toHaveBeenCalledOnce()
	expect(close).toHaveBeenCalledOnce()
})

it('shares a pending rejecting destroy promise across concurrent callers', async () => {
	const failure = new Error('persistence close failed')
	let rejectClose: (error: Error) => void = () => {}
	const close = vi.fn(() => new Promise<void>((_resolve, reject) => {
		rejectClose = reject
	}))
	const client = { destroy: vi.fn() }
	const unregister = vi.fn()
	const runtime = await openApplicationClientLifecycle({
		persistenceRuntime: { close },
		createClient: async () => client,
		register: vi.fn(),
		unregister,
	})

	const first = runtime.destroy()
	const second = runtime.destroy()
	let firstSettled = false
	let secondSettled = false
	void first.then(() => { firstSettled = true }, () => { firstSettled = true })
	void second.then(() => { secondSettled = true }, () => { secondSettled = true })
	await Promise.resolve()
	await Promise.resolve()
	expect(firstSettled).toBe(false)
	expect(secondSettled).toBe(false)
	const firstFailure = first.catch((error) => error)
	const secondFailure = second.catch((error) => error)
	rejectClose(failure)
	const [firstError, secondError] = await Promise.all([firstFailure, secondFailure])
	expect(firstError).toBe(secondError)
	expect(firstError).toMatchObject({ errors: [failure] })
	expect(unregister).toHaveBeenCalledOnce()
	expect(client.destroy).toHaveBeenCalledOnce()
	expect(close).toHaveBeenCalledOnce()
})
