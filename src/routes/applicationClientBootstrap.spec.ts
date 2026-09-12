import { afterEach, beforeEach, expect, test, vi } from 'vitest'

const dependencies = vi.hoisted(() => ({
	capabilities: vi.fn<() => Promise<{ enabledServerBindingIds: string[] }>>(),
	resolvers: vi.fn<() => Promise<object>>(),
	construct: vi.fn(() => ({ destroy: vi.fn() })),
	track: vi.fn(() => ({ persistence: {}, waitForPersistence: vi.fn() })),
}))

vi.mock('$/polyfills.ts', () => ({}))
vi.mock('@tanstack/query-core', () => ({ QueryClient: class {} }))
vi.mock('$env/dynamic/public', () => ({ env: {} }))
vi.mock('$/client/$client.svelte.ts', () => ({
	client: () => () => dependencies.construct,
	trackPersistedCollectionPersistence: dependencies.track,
}))
vi.mock('$/constants/Persistence.ts', () => ({ BLOCKHEAD_PERSISTED_COLLECTION_SCHEMA_VERSION: 1 }))
vi.mock('$/resolvers/index.ts', () => ({ loadResolvers: dependencies.resolvers }))
vi.mock('$/schema/index.ts', () => ({ schema: {}, schemaMeta: {} }))
vi.mock('$/sources/index.ts', () => ({ browserDirectSourceBindingIds: [], sourceProviders: {} }))
vi.mock('$/sources/$sources.ts', () => ({ indexSourceProviders: () => ({ enabledSources: [] }) }))
vi.mock('$/sources/_runtime/capabilities.remote.ts', () => ({ sourceRuntimeCapabilities: dependencies.capabilities }))
vi.mock('$/lib/db/browserPersistenceRuntime.ts', () => ({
	BrowserPersistenceRuntime: class {
		ready = Promise.resolve()
		persistence = {}
	},
}))

import { BrowserPersistenceRuntime } from '$/lib/db/browserPersistenceRuntime.ts'
import { bootstrapApplicationClient } from './applicationClientBootstrap.ts'
import { applicationRuntimeWhenReady } from './applicationRuntime.ts'

const unhandled = vi.fn()

beforeEach(() => {
	dependencies.capabilities.mockReset().mockResolvedValue({ enabledServerBindingIds: [] })
	dependencies.resolvers.mockReset().mockResolvedValue({})
	dependencies.construct.mockClear()
	dependencies.track.mockClear()
	unhandled.mockClear()
	process.on('unhandledRejection', unhandled)
})

afterEach(() => {
	process.off('unhandledRejection', unhandled)
})

const persistence = () => new BrowserPersistenceRuntime({
	name: 'bootstrap-test',
	openOwner: async () => { throw new Error('Mocked runtime must not acquire OPFS') },
})

test.each(['capabilities', 'resolvers'])('teardown during %s rejects through application runtime without late construction or an unhandled rejection', async phase => {
	const capabilities = Promise.withResolvers<{ enabledServerBindingIds: string[] }>()
	const resolvers = Promise.withResolvers<object>()
	const resolverStarted = Promise.withResolvers<void>()
	dependencies.capabilities.mockReturnValue(capabilities.promise)
	dependencies.resolvers.mockImplementation(() => {
		resolverStarted.resolve()
		return resolvers.promise
	})
	const abort = new AbortController()
	const mount = vi.fn(() => ({ destroy: vi.fn() }))
	const runtime = applicationRuntimeWhenReady(bootstrapApplicationClient(persistence(), abort.signal), mount)
	const rejected = expect(runtime.ready).rejects.toMatchObject({ name: 'AbortError' })
	if (phase === 'resolvers') {
		capabilities.resolve({ enabledServerBindingIds: [] })
		await resolverStarted.promise
	}

	abort.abort()
	runtime.destroy()
	capabilities.resolve({ enabledServerBindingIds: [] })
	resolvers.resolve({})
	await rejected
	await new Promise(resolve => setTimeout(resolve, 0))
	expect(dependencies.track).not.toHaveBeenCalled()
	expect(dependencies.construct).not.toHaveBeenCalled()
	expect(mount).not.toHaveBeenCalled()
	expect(unhandled).not.toHaveBeenCalled()
})

test('resolver failure retains its identity through application runtime', async () => {
	const failure = new Error('resolver loading failed')
	dependencies.resolvers.mockRejectedValue(failure)
	const mount = vi.fn(() => ({ destroy: vi.fn() }))
	const runtime = applicationRuntimeWhenReady(bootstrapApplicationClient(persistence(), new AbortController().signal), mount)
	await expect(runtime.ready).rejects.toBe(failure)
	await new Promise(resolve => setTimeout(resolve, 0))
	expect(dependencies.construct).not.toHaveBeenCalled()
	expect(mount).not.toHaveBeenCalled()
	expect(unhandled).not.toHaveBeenCalled()
})

test('successful bootstrap constructs and mounts once', async () => {
	const destroy = vi.fn()
	const mount = vi.fn(() => ({ destroy }))
	const runtime = applicationRuntimeWhenReady(bootstrapApplicationClient(persistence(), new AbortController().signal), mount)
	await runtime.ready
	expect(dependencies.track).toHaveBeenCalledOnce()
	expect(dependencies.construct).toHaveBeenCalledOnce()
	expect(mount).toHaveBeenCalledOnce()
	runtime.destroy()
	expect(destroy).toHaveBeenCalledOnce()
})
