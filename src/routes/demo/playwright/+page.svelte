<script lang="ts">
	// Types/constants
	import type { QueryLike } from '$/lib/db/queryResource.svelte.ts'


	let cachedBoundaryOpen = $state(
		true
	)

	const cachedQuery = {
		data: 'Cached value',
		isLoading: false,
		isError: false,
		isReady: true,
	} satisfies QueryLike<string>

	let liveQuery = $state<QueryLike<string>>({
		data: '',
		isLoading: true,
		isError: false,
		isReady: false,
	})
	let remoteValue = $state('')
	let remoteReady = $state(false)
	let queryTaggedValue = $state('')
	let queryTaggedReady = $state(false)
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

	const applySubscribedValue = (
		value: string,
	) => {
		liveQuery = {
			data: value,
			isLoading: false,
			isError: false,
			isReady: true,
		}
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
</script>


<h1>Playwright e2e test demo</h1>

<Collapsible
	bind:open={cachedBoundaryOpen}
>
	{#snippet Summary()}
		<span>Cached boundary</span>
	{/snippet}

	<ResourceBoundary
		resource={cachedQuery}
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

	<ResourceBoundary
		resource={liveQuery}
		placeholderText="Loading subscribed value"
	>
		{#snippet children(value)}
			<p>{value}</p>
		{/snippet}
	</ResourceBoundary>
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
