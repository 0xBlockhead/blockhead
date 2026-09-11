import {
	expect,
	it,
	vi,
} from 'vitest'

import {
	createApplicationRuntimeCloser,
	createApplicationPresentationSessionState,
} from './applicationPresentationRuntime.ts'

it('restores the authoritative checkpoint and allocates one fresh session identity', async () => {
	const checkpoint = {
		revision: 7,
		value: 'persisted',
	}
	const load = vi.fn(async () => checkpoint)
	const save = vi.fn(async () => {})
	const state = await createApplicationPresentationSessionState({
		selector: 'network:eip155:1',
		checkpointStore: {
			load,
			save,
		},
		checkpointRevision: (value) => value.revision,
		persistenceGeneration: 11,
		nextMountId: () => 'mount-3',
		nextSubscriptionGeneration: () => 5,
	})

	expect(load).toHaveBeenCalledExactlyOnceWith('network:eip155:1')
	expect(state).toMatchObject({
		selector: 'network:eip155:1',
		mountId: 'mount-3',
		subscriptionGeneration: 5,
		persistenceGeneration: 11,
		initialRevision: 7,
		initialCheckpoint: checkpoint,
	})
	await state.saveCheckpoint({ revision: 8, value: 'updated' })
	expect(save).toHaveBeenCalledExactlyOnceWith(
		'network:eip155:1',
		{ revision: 8, value: 'updated' }
	)
})

it('starts a fresh selector without fabricating a restored revision', async () => {
	const state = await createApplicationPresentationSessionState({
		selector: 'network:eip155:1',
		checkpointStore: {
			load: async () => undefined,
			save: async () => {},
		},
		checkpointRevision: () => 99,
		persistenceGeneration: 1,
		nextMountId: () => 'mount-1',
		nextSubscriptionGeneration: () => 1,
	})

	expect(state.initialCheckpoint).toBeUndefined()
	expect(state.initialRevision).toBe(0)
})

it('allocates session identity in invocation order rather than checkpoint completion order', async () => {
	let releaseFirstLoad = () => {}
	let releaseSecondLoad = () => {}
	const firstLoad = new Promise<undefined>((resolve) => {
		releaseFirstLoad = () => resolve(undefined)
	})
	const secondLoad = new Promise<undefined>((resolve) => {
		releaseSecondLoad = () => resolve(undefined)
	})
	let mount = 0
	let subscription = 0
	const shared = {
		checkpointRevision: () => 0,
		persistenceGeneration: 1,
		nextMountId: () => `mount-${++mount}`,
		nextSubscriptionGeneration: () => ++subscription,
	}
	const first = createApplicationPresentationSessionState({
		...shared,
		selector: 'first',
		checkpointStore: {
			load: () => firstLoad,
			save: async () => {},
		},
	})
	const second = createApplicationPresentationSessionState({
		...shared,
		selector: 'second',
		checkpointStore: {
			load: () => secondLoad,
			save: async () => {},
		},
	})

	releaseSecondLoad()
	expect(await second).toMatchObject({
		mountId: 'mount-2',
		subscriptionGeneration: 2,
	})
	releaseFirstLoad()
	expect(await first).toMatchObject({
		mountId: 'mount-1',
		subscriptionGeneration: 1,
	})
})

it('closes presentation, navigation, then client once in authority order', async () => {
	const order: string[] = []
	const closer = createApplicationRuntimeCloser(
		{ destroy: () => order.push('presentation') },
		{ destroy: async () => { order.push('navigation') } },
		{ destroy: () => order.push('client') }
	)
	await closer.destroy()
	await closer.destroy()

	expect(order).toEqual(['presentation', 'navigation', 'client'])
})

it('attempts every runtime close while preserving teardown failures', async () => {
	const failure = new Error('presentation close failed')
	const order: string[] = []
	const closer = createApplicationRuntimeCloser(
		{ destroy: () => {
			order.push('presentation')
			throw failure
		} },
		{ destroy: () => { order.push('navigation') } },
		{ destroy: () => { order.push('client') } }
	)

	await expect(closer.destroy()).rejects.toMatchObject({ errors: [failure] })
	await expect(closer.destroy()).rejects.toMatchObject({ errors: [failure] })
	expect(order).toEqual(['presentation', 'navigation', 'client'])
})
