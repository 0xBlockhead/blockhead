import { beforeEach, expect, test, vi } from 'vitest'
import type { BrowserPersistenceRuntimeOptions } from './browserPersistenceRuntime.ts'

const dependencies = vi.hoisted(() => ({
	open: vi.fn(async () => ({ close: vi.fn() })),
	closing: new Map<object, PromiseWithResolvers<void>>(),
}))

vi.mock('@tanstack/browser-db-sqlite-persistence', () => ({
	openBrowserWASQLiteOPFSDatabase: dependencies.open,
	createBrowserWASQLitePersistence: () => ({}),
}))
vi.mock('$/constants/Persistence.ts', () => ({ BLOCKHEAD_WA_SQLITE_DATABASE_NAME: 'singleton-test' }))
vi.mock('./browserPersistenceRuntime.ts', () => ({
	BrowserPersistenceRuntime: class {
		ready: Promise<void>
		constructor(options: BrowserPersistenceRuntimeOptions) {
			dependencies.closing.set(this, Promise.withResolvers<void>())
			this.ready = options.openOwner().then(() => {})
		}
		close() { return dependencies.closing.get(this)?.promise }
	},
}))

beforeEach(() => {
	vi.resetModules()
	dependencies.open.mockClear()
	dependencies.closing.clear()
})

test('release replaces only its own singleton and preserves every pending close before opening', async () => {
	const { getBrowserPersistenceRuntime, releaseBrowserPersistenceRuntime } = await import('./browserPersistenceSingleton.ts')
	const first = getBrowserPersistenceRuntime()
	await first.ready
	const firstClose = releaseBrowserPersistenceRuntime(first)
	const second = getBrowserPersistenceRuntime()
	expect(second).not.toBe(first)
	await new Promise(resolve => setTimeout(resolve, 0))
	expect(dependencies.open).toHaveBeenCalledTimes(1)
	const secondClose = releaseBrowserPersistenceRuntime(second)
	dependencies.closing.get(second)?.resolve()
	const third = getBrowserPersistenceRuntime()
	void releaseBrowserPersistenceRuntime(first)
	expect(getBrowserPersistenceRuntime()).toBe(third)
	await new Promise(resolve => setTimeout(resolve, 0))
	expect(dependencies.open).toHaveBeenCalledTimes(1)
	dependencies.closing.get(first)?.resolve()
	await Promise.all([firstClose, secondClose, second.ready, third.ready])
	expect(dependencies.open).toHaveBeenCalledTimes(3)
	const thirdClose = releaseBrowserPersistenceRuntime(third)
	dependencies.closing.get(third)?.resolve()
	await thirdClose
})

test('a failed close remains observable and blocks successor database opening', async () => {
	const { getBrowserPersistenceRuntime, releaseBrowserPersistenceRuntime } = await import('./browserPersistenceSingleton.ts')
	const first = getBrowserPersistenceRuntime()
	await first.ready
	const failure = new Error('database close failed')
	const close = releaseBrowserPersistenceRuntime(first)
	const successor = getBrowserPersistenceRuntime()
	const failures = Promise.all([
		expect(close).rejects.toBe(failure),
		expect(successor.ready).rejects.toBe(failure),
	])
	dependencies.closing.get(first)?.reject(failure)
	await failures
	expect(dependencies.open).toHaveBeenCalledTimes(1)
})
