<script lang="ts">
	// Types/constants
	import type { PersistedCollectionContinuation } from '$/client/$client.svelte.ts'
	import { EntityMetaKey, type Entity } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { RegisteredSchema } from '$/schema/index.ts'
	import { TanStackLiveQueryResource } from '$/lib/db/queryResource.svelte.ts'

	type Item = (
		& Entity<RegisteredSchema, EntityType._GlobalAtprotoNetwork>
		& {
			[EntityMetaKey.SelectorKey]: string
			value: Entity<RegisteredSchema, EntityType._GlobalAtprotoNetwork>
		}
	)

	const firstItem: Item = {
		[EntityMetaKey.Selector]: {
			scope: '_GlobalAtprotoNetwork',
		},
		[EntityMetaKey.SelectorKey]: 'first',
		protocolName: 'First page item',
		value: {
			[EntityMetaKey.Selector]: {
				scope: '_GlobalAtprotoNetwork',
			},
		},
	}
	const secondItem: Item = {
		[EntityMetaKey.Selector]: {
			scope: '_GlobalAtprotoNetwork',
		},
		[EntityMetaKey.SelectorKey]: 'second',
		protocolName: 'Retried page item',
		value: {
			[EntityMetaKey.Selector]: {
				scope: '_GlobalAtprotoNetwork',
			},
		},
	}


	// State
	let items = $state<Item[]>([
		firstItem,
	])
	let attempts = $state(0)
	let error = $state(false)
	let loading = $state(false)
	let terminal = $state(false)
	let settleLoad = $state<(outcome: 'failed' | 'succeeded') => void>()
	const continuation: PersistedCollectionContinuation = {
		source: 'fixture',
		get metadata() {
			return terminal ?
				{
					operation: 'fixture',
					target: 'fixture',
					terminal: true,
				}
			:
				{
					operation: 'fixture',
					target: 'fixture',
					terminal: false,
					token: 'next',
				}
		},
		get error() {
			return error
		},
		get loading() {
			return loading
		},
		loadMore: () => {
			attempts += 1
			error = false
			loading = true
			return new Promise((resolve, reject) => {
				settleLoad = (outcome) => {
					loading = false
					if (outcome === 'failed') {
						error = true
						reject(new Error('Continuation failed'))
						return
					}

					items = [
						...items,
						secondItem,
					]
					terminal = true
					resource.set({
						continuation,
						values: items,
					})
					resolve()
				}
			})
		},
		cancel: () => {},
	}
	const resource = new TanStackLiveQueryResource(() => ({
		data: {
			continuation,
			values: items,
		},
		isError: false,
		isLoading: false,
		isReady: true,
		status: 'ready',
	}))


	// Components
	import EntitiesList from './EntitiesList.svelte'
</script>


<button
	type="button"
	onclick={() => settleLoad?.('failed')}
>
	Reject page
</button>

<button
	type="button"
	onclick={() => settleLoad?.('succeeded')}
>
	Resolve page
</button>

<span>Attempts: {attempts}</span>

<EntitiesList
	entityType={EntityType._GlobalAtprotoNetwork}
	id="entities-list-pagination-fixture"
	{resource}
>
	{#snippet Item({ item })}
		<span>{item.protocolName}</span>
	{/snippet}
</EntitiesList>
