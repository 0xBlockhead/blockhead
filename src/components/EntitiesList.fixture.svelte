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
	const thirdItem: Item = {
		[EntityMetaKey.Selector]: {
			scope: '_GlobalAtprotoNetwork',
		},
		[EntityMetaKey.SelectorKey]: 'third',
		protocolName: 'Later page item',
		value: {
			[EntityMetaKey.Selector]: {
				scope: '_GlobalAtprotoNetwork',
			},
		},
	}
	type Token = 'next' | 'later'


	// State
	let values = $state<Item[]>([
		firstItem,
	])
	let token = $state<Token | undefined>('next')
	let failedToken = $state<Token>()
	let loadingToken = $state<Token>()
	let attempts = $state<Record<Token, number>>({
		next: 0,
		later: 0,
	})
	let settleLoad = $state<(
		token: Token,
		outcome: 'failed' | 'succeeded'
	) => void>()
	let pendingLoad = $state<{
		token: Token
		promise: Promise<void>
		resolve: () => void
		reject: (error: Error) => void
	} | undefined>()
	const continuation: PersistedCollectionContinuation = {
		source: 'fixture',
		get metadata() {
			return token === undefined ?
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
					token,
				}
		},
		get error() {
			return token !== undefined && failedToken === token
		},
		get loading() {
			return token !== undefined && loadingToken === token
		},
		loadMore: () => {
			if (token === undefined)
				return Promise.resolve()
			if (pendingLoad?.token === token)
				return pendingLoad.promise

			const requestedToken = token
			attempts[requestedToken] += 1
			failedToken = undefined
			loadingToken = requestedToken
			const pending = Promise.withResolvers<void>()
			pendingLoad = {
				token: requestedToken,
				promise: pending.promise,
				resolve: pending.resolve,
				reject: pending.reject,
			}
			settleLoad = (settledToken, outcome) => {
				if (settledToken !== requestedToken)
					return
				loadingToken = undefined
				pendingLoad = undefined
				settleLoad = undefined
				if (outcome === 'failed') {
					failedToken = requestedToken
					pending.reject(new Error('Continuation failed'))
					return
				}

				values = [
					...values,
					requestedToken === 'next' ? secondItem : thirdItem,
				]
				token = requestedToken === 'next' ? 'later' : undefined
				resource.set({
					continuation,
					values,
				})
				pending.resolve()
			}
			return pending.promise
		},
		cancel: () => {},
	}
	const resource = new TanStackLiveQueryResource(() => ({
		data: {
			continuation,
			values,
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
	onclick={() => token !== undefined && settleLoad?.(token, 'failed')}
>
	{token === 'next' ? 'Reject page' : 'Reject current page'}
</button>

<button
	type="button"
	onclick={() => token !== undefined && settleLoad?.(token, 'succeeded')}
>
	Resolve page
</button>

<span>Next attempts: {attempts.next}</span>
<span>Later attempts: {attempts.later}</span>

<EntitiesList
	entityType={EntityType._GlobalAtprotoNetwork}
	id="entities-list-pagination-fixture"
	{resource}
>
	{#snippet Item({ item })}
		<span>{item.protocolName}</span>
	{/snippet}
</EntitiesList>
