<script lang="ts">
	// Types/constants
	import {
		type TanStackLiveQuerySnapshot,
		type SvelteKitResource,
		TanStackLiveQueryResource,
	} from '$/lib/db/queryResource.svelte.ts'
	import { SpecificationRealm } from '$/constants/SpecificationProposal.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	let cachedBoundaryOpen = $state(
		true
	)

	const cachedQuery = {
		data: 'Cached value',
		isLoading: false,
		isError: false,
		isReady: true,
	} satisfies TanStackLiveQuerySnapshot<string>
	const cachedResource = new TanStackLiveQueryResource(() => cachedQuery)

	const initialLiveQuery = {
		data: '',
		isLoading: true,
		isError: false,
		isReady: false,
	} satisfies TanStackLiveQuerySnapshot<string>
	let liveQuery = $state<TanStackLiveQuerySnapshot<string>>(initialLiveQuery)
	const liveQueryListeners = new Set<() => void>()
	const subscribedResource = new TanStackLiveQueryResource(
		() => liveQuery,
		(update) => {
			liveQueryListeners.add(update)
			return () => {
				liveQueryListeners.delete(update)
			}
		},
	)

	let remoteValue = $state('')
	let remoteReady = $state(false)
	let queryTaggedValue = $state('')
	let queryTaggedReady = $state(false)
	let showFailedResource = $state(false)
	let showRealSubscribedScalarResource = $state(false)
	let showRealSubscribedResource = $state(false)
	let showRealSubscribedCountResource = $state(false)
	const remotePromise = Promise.resolve('Remote subscribed value')
	const remoteResource = {
		then: remotePromise.then.bind(remotePromise),
		catch: remotePromise.catch.bind(remotePromise),
		finally: remotePromise.finally.bind(remotePromise),
		get current() {
			return remoteReady ? remoteValue : undefined
		},
		get error() {
			return undefined
		},
		get ready() {
			return remoteReady
		},
		get loading() {
			return !remoteReady
		},
		[Symbol.toStringTag]: 'RemoteResource',
	}
	const queryTaggedPromise = Promise.resolve('Query tagged value')
	const partiallyReadyPromise = Promise.resolve('Partially ready value')
	const queryTaggedResource = {
		then: queryTaggedPromise.then.bind(queryTaggedPromise),
		catch: queryTaggedPromise.catch.bind(queryTaggedPromise),
		finally: queryTaggedPromise.finally.bind(queryTaggedPromise),
		get current() {
			return queryTaggedReady ? queryTaggedValue : undefined
		},
		get error() {
			return undefined
		},
		get ready() {
			return queryTaggedReady
		},
		get loading() {
			return !queryTaggedReady
		},
		[Symbol.toStringTag]: 'Query',
	}
	const partiallyReadyResource = {
		then: partiallyReadyPromise.then.bind(partiallyReadyPromise),
		catch: partiallyReadyPromise.catch.bind(partiallyReadyPromise),
		finally: partiallyReadyPromise.finally.bind(partiallyReadyPromise),
		get current() {
			return 'Partially ready value'
		},
		get error() {
			return undefined
		},
		get ready() {
			return false
		},
		get loading() {
			return true
		},
		[Symbol.toStringTag]: 'RemoteResource',
	}
	const failedPromise = Promise.reject('Boundary failure')
	failedPromise.catch(() => {})
	const failedResource = {
		then: failedPromise.then.bind(failedPromise),
		catch: failedPromise.catch.bind(failedPromise),
		finally: failedPromise.finally.bind(failedPromise),
		get current() {
			return undefined
		},
		get error() {
			return 'Boundary failure'
		},
		get ready() {
			return false
		},
		get loading() {
			return false
		},
		[Symbol.toStringTag]: 'Query',
	} satisfies SvelteKitResource<string>
	const applySubscribedValue = (
		value: string,
	) => {
		liveQuery.data = value
		liveQuery.isLoading = false
		liveQuery.isError = false
		liveQuery.isReady = true
		for (const listener of liveQueryListeners)
			listener()
	}

	const applyRemoteValue = (
		value: string,
	) => {
		remoteValue = value
		remoteReady = true
	}

	const applyQueryTaggedValue = (
		value: string,
	) => {
		queryTaggedValue = value
		queryTaggedReady = true
	}

	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { subscribe } from '$/routes/+layout.svelte'
</script>


<h1>Resource boundary test route</h1>

<Collapsible
	bind:open={cachedBoundaryOpen}
>
	{#snippet Summary()}
		<span>Cached boundary</span>
	{/snippet}

	<ResourceBoundary
		resource={cachedResource}
		placeholderText="Loading cached value"
	>
		{#snippet children(value)}
			<p>{value}</p>
		{/snippet}
	</ResourceBoundary>
</Collapsible>

<section>
	<h2>Subscribed boundary</h2>

	<button onclick={() => applySubscribedValue('Subscribed value')}>
		Resolve subscribed boundary
	</button>

	<button onclick={() => applySubscribedValue('Updated subscribed value')}>
		Update subscribed boundary
	</button>

	<p data-testid="subscribed-direct-current">{subscribedResource.current ?? ''}</p>

	<ResourceBoundary
		resource={subscribedResource}
		placeholderText="Loading subscribed value"
	>
		{#snippet children(value)}
			<p>{value}</p>
		{/snippet}
	</ResourceBoundary>

	<svelte:boundary>
		<p data-testid="subscribed-awaited-value">{await subscribedResource}</p>

		{#snippet pending()}
			<p data-testid="subscribed-awaited-value">pending</p>
		{/snippet}
	</svelte:boundary>
</section>

<section>
	<h2>Real subscribeEntity boundary</h2>

	<button onclick={() => showRealSubscribedScalarResource = true}>
		Show real subscribeEntity scalar boundary
	</button>

	<button onclick={() => showRealSubscribedResource = true}>
		Show real subscribeEntity rows boundary
	</button>

	<button onclick={() => showRealSubscribedCountResource = true}>
		Show real subscribeEntity count boundary
	</button>

	{#if showRealSubscribedScalarResource}
		<ResourceBoundary
			resource={subscribe(
				EntityType.SpecificationRealm,
				{
					realm: SpecificationRealm.Ethereum,
				},
				{
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						label: true,
						slug: true,
					},
				},
			)}
			placeholderText="Loading real subscribeEntity scalar value"
		>
			{#snippet children(value)}
				<p data-testid="real-resource-boundary-scalars">{value.fields.label}:{value.fields.slug}</p>
			{/snippet}
		</ResourceBoundary>
	{/if}

	{#if showRealSubscribedResource}
		<ResourceBoundary
			resource={subscribe(
				EntityType.SpecificationRealm,
				{
					realm: SpecificationRealm.Ethereum,
				},
				{
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						$$proposalKinds: true,
					},
				},
			)}
			placeholderText="Loading real subscribeEntity value"
		>
			{#snippet children(value)}
				<p data-testid="real-resource-boundary-rows">{value.fields.$$proposalKinds.values.length}</p>
			{/snippet}
		</ResourceBoundary>
	{/if}

	{#if showRealSubscribedCountResource}
		<ResourceBoundary
			resource={subscribe(
				EntityType.SpecificationRealm,
				{
					realm: SpecificationRealm.Ethereum,
				},
				{
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						$$proposalKinds: {
							count: true,
						},
					},
				},
			)}
			placeholderText="Loading real subscribeEntity count"
		>
			{#snippet children(value)}
				<p data-testid="real-resource-boundary-count">
					{value.fields.$$proposalKinds.values.length}:{value.fields.$$proposalKinds.totalCount ?? ''}
				</p>
			{/snippet}
		</ResourceBoundary>
	{/if}
</section>

<section>
	<h2>SvelteKit query resource boundary</h2>

	<button onclick={() => applyQueryTaggedValue('Query tagged value')}>
		Resolve query resource boundary
	</button>

	<button onclick={() => applyQueryTaggedValue('Updated query tagged value')}>
		Update query resource boundary
	</button>

	<ResourceBoundary
		resource={queryTaggedResource}
		placeholderText="Loading query resource value"
	>
		{#snippet children(value)}
			<p>{value}</p>
		{/snippet}
	</ResourceBoundary>
</section>

<section>
	<h2>Failed resource boundary</h2>

	<button onclick={() => showFailedResource = true}>
		Show failed resource
	</button>

	{#if showFailedResource}
		<ResourceBoundary
			resource={failedResource}
			placeholderText="Loading failed value"
		>
			{#snippet children(value)}
				<p>{value}</p>
			{/snippet}

			{#snippet Failed(error)}
				<p data-testid="failed-resource-message">{String(error)}</p>
			{/snippet}
		</ResourceBoundary>
	{/if}
</section>

<section>
	<h2>Remote resource boundary</h2>

	<button onclick={() => applyRemoteValue('Remote subscribed value')}>
		Resolve remote boundary
	</button>

	<button onclick={() => applyRemoteValue('Updated remote value')}>
		Update remote boundary
	</button>

	<ResourceBoundary
		resource={remoteResource}
		placeholderText="Loading remote value"
	>
		{#snippet children(value)}
			<p>{value}</p>
		{/snippet}
	</ResourceBoundary>
</section>

<section>
	<h2>Partially ready resource boundary</h2>

	<ResourceBoundary
		resource={partiallyReadyResource}
		placeholderText="Loading partially ready value"
	>
		{#snippet children(value)}
			<p>{value}</p>
		{/snippet}
	</ResourceBoundary>
</section>
