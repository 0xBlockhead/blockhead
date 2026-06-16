<script lang="ts">
	// Types/constants
	import { writeLocalBlockheadSessionName } from '$/collections/localMutations.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import { SpecificationRealm } from '$/constants/SpecificationProposal.ts'
	import {
		type TanStackLiveQuerySnapshot,
		type SvelteKitResource,
		TanStackLiveQueryResource,
	} from '$/lib/db/queryResource.svelte.ts'
	import {
		appClient,
		subscribe,
	} from '$/routes/+layout.svelte'


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
		status: 'loading',
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

	const initialFailableQuery = {
		data: '',
		isLoading: true,
		isError: false,
		isReady: false,
		status: 'loading',
	} satisfies TanStackLiveQuerySnapshot<string>
	let failableQuery = $state<TanStackLiveQuerySnapshot<string>>(initialFailableQuery)
	const failableQueryListeners = new Set<() => void>()
	const failableResource = new TanStackLiveQueryResource(
		() => failableQuery,
		(update) => {
			failableQueryListeners.add(update)
			return () => {
				failableQueryListeners.delete(update)
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
	let resolveRemotePromise: (value: string) => void = () => {}
	let resolveQueryTaggedPromise: (value: string) => void = () => {}
	const remotePromise = new Promise<string>((resolve) => {
		resolveRemotePromise = resolve
	})
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
	const queryTaggedPromise = new Promise<string>((resolve) => {
		resolveQueryTaggedPromise = resolve
	})
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
	const failedResource = {
		then: (...parameters: Parameters<Promise<string>['then']>) => (
			Promise.reject<string>(new Error('Boundary failure')).then(...parameters)
		),
		catch: (...parameters: Parameters<Promise<string>['catch']>) => (
			Promise.reject<string>(new Error('Boundary failure')).catch(...parameters)
		),
		finally: (...parameters: Parameters<Promise<string>['finally']>) => (
			Promise.reject<string>(new Error('Boundary failure')).finally(...parameters)
		),
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
	const realSubscribedScalarResource = subscribe(
		EntityType.BlockheadSession,
		{
			id: 'e2e-probe-session',
		},
		{
			sources: [
				Source.Local_Internal,
			],
			fields: {
				name: true,
				status: true,
			},
		},
	)
	const realSubscribedBoundaryOnlyResource = subscribe(
		EntityType.BlockheadSession,
		{
			id: 'e2e-probe-session',
		},
		{
			sources: [
				Source.Local_Internal,
			],
			fields: {
				name: true,
				status: true,
			},
		},
	)
	const realSubscribedDirectOnlyResource = subscribe(
		EntityType.BlockheadSession,
		{
			id: 'e2e-probe-direct-session',
		},
		{
			sources: [
				Source.Local_Internal,
			],
			fields: {
				name: true,
				status: true,
			},
		},
	)
	let realSubscribedDirectOnly = $derived(
		realSubscribedDirectOnlyResource.current
	)
	const applySubscribedValue = (
		value: string,
	) => {
		liveQuery.data = value
		liveQuery.isLoading = false
		liveQuery.isError = false
		liveQuery.isReady = true
		liveQuery.error = undefined
		liveQuery.status = 'ready'
		for (const listener of liveQueryListeners)
			listener()
	}

	const applySubscribedLoading = () => {
		liveQuery.isLoading = true
		liveQuery.isError = false
		liveQuery.isReady = false
		liveQuery.error = undefined
		liveQuery.status = 'loading'
		for (const listener of liveQueryListeners)
			listener()
	}

	const applyFailableValue = (
		value: string,
	) => {
		failableQuery.data = value
		failableQuery.isLoading = false
		failableQuery.isError = false
		failableQuery.isReady = true
		failableQuery.error = undefined
		failableQuery.status = 'ready'
		for (const listener of failableQueryListeners)
			listener()
	}

	const applyFailableError = () => {
		failableQuery.data = ''
		failableQuery.isLoading = false
		failableQuery.isError = true
		failableQuery.isReady = false
		failableQuery.error = 'Failable boundary failure'
		failableQuery.status = 'error'
		for (const listener of failableQueryListeners)
			listener()
	}

	const applyRemoteValue = (
		value: string,
	) => {
		remoteValue = value
		remoteReady = true
		resolveRemotePromise(value)
	}

	const applyQueryTaggedValue = (
		value: string,
	) => {
		queryTaggedValue = value
		queryTaggedReady = true
		resolveQueryTaggedPromise(value)
	}

	const applyRealSubscribedLabelValue = (
		value: string,
	) => {
		writeLocalBlockheadSessionName(appClient, {
			id: 'e2e-probe-session',
		}, value)
	}

	const applyRealSubscribedBoundaryOnlyLabelValue = (
		value: string,
	) => {
		writeLocalBlockheadSessionName(appClient, {
			id: 'e2e-probe-session',
		}, value)
	}

	const applyRealSubscribedDirectOnlyLabelValue = (
		value: string,
	) => {
		writeLocalBlockheadSessionName(appClient, {
			id: 'e2e-probe-direct-session',
		}, value)
	}

	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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

	<button onclick={applySubscribedLoading}>
		Refresh subscribed boundary
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
			<p data-testid="subscribed-boundary-value">{value}</p>
		{/snippet}
	</ResourceBoundary>

	<ResourceBoundary
		resource={subscribedResource}
		placeholderText="Loading subscribed duplicate value"
	>
		{#snippet children(value)}
			<p data-testid="subscribed-boundary-value-secondary">{value}</p>
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
	<h2>Failable TanStack resource boundary</h2>

	<button onclick={() => applyFailableValue('Failable value')}>
		Resolve failable boundary
	</button>

	<button onclick={applyFailableError}>
		Fail failable boundary
	</button>

	<button onclick={() => applyFailableValue('Recovered failable value')}>
		Recover failable boundary
	</button>

	<ResourceBoundary
		resource={failableResource}
		placeholderText="Loading failable value"
	>
		{#snippet children(value)}
			<p data-testid="failable-boundary-value">{value}</p>
		{/snippet}

		{#snippet Failed(error, retry)}
			<p data-testid="failable-boundary-error">{String(error)}</p>

			<button
				data-testid="failable-boundary-retry"
				onclick={retry}
			>
				Retry failable boundary
			</button>
		{/snippet}
	</ResourceBoundary>
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

	<button onclick={() => applyRealSubscribedLabelValue('Boundary Session')}>
		Seed real subscribeEntity scalar field
	</button>

	<button onclick={() => applyRealSubscribedLabelValue('Updated Boundary Session')}>
		Update real subscribeEntity scalar field
	</button>

	<button onclick={() => applyRealSubscribedBoundaryOnlyLabelValue('Boundary Only Session')}>
		Seed boundary-only live subscription field
	</button>

	<button onclick={() => applyRealSubscribedBoundaryOnlyLabelValue('Updated Boundary Only Session')}>
		Update boundary-only live subscription field
	</button>

	<button onclick={() => applyRealSubscribedDirectOnlyLabelValue('Updated Direct Only Session')}>
		Update direct-only live subscription field
	</button>

	{#if showRealSubscribedScalarResource}
		{@const realSubscribedScalar = realSubscribedScalarResource.current}

		<p data-testid="real-resource-direct-scalars">
			{realSubscribedScalar?.fields.name ?? ''}:{realSubscribedScalar?.fields.status ?? ''}
		</p>

		<svelte:boundary>
			{@const value = await realSubscribedScalarResource}

			<p data-testid="real-resource-awaited-scalars">{value.fields.name}:{value.fields.status}</p>

			{#snippet pending()}
				<p data-testid="real-resource-awaited-scalars">pending</p>
			{/snippet}
		</svelte:boundary>

		<ResourceBoundary
			resource={realSubscribedScalarResource}
			placeholderText="Loading real subscribeEntity scalar value"
		>
			{#snippet children(value)}
				<p data-testid="real-resource-boundary-scalars">{value.fields.name}:{value.fields.status}</p>
			{/snippet}
		</ResourceBoundary>
	{/if}

	<ResourceBoundary
		resource={realSubscribedBoundaryOnlyResource}
		placeholderText="Loading real subscribeEntity boundary-only live subscription"
	>
		{#snippet children(value)}
			<p data-testid="real-resource-boundary-only-scalars">{value.fields.name}:{value.fields.status}</p>
		{/snippet}
	</ResourceBoundary>

	<p data-testid="real-resource-direct-only-current">
		{realSubscribedDirectOnly?.fields.name ?? ''}:{realSubscribedDirectOnly?.fields.status ?? ''}
	</p>

	<p data-testid="real-resource-direct-only-loading">
		{String(realSubscribedDirectOnlyResource.loading)}
	</p>

	<p data-testid="real-resource-direct-only-ready">
		{String(realSubscribedDirectOnlyResource.ready)}
	</p>

	<p data-testid="real-resource-direct-only-error">
		{realSubscribedDirectOnlyResource.error?.map((error) => error.message).join(', ') ?? ''}
	</p>

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
			<p data-testid="query-tagged-boundary-value">{value}</p>
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
				<p data-testid="failed-resource-message">{error instanceof Error ? error.message : String(error)}</p>
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
			<p data-testid="remote-boundary-value">{value}</p>
		{/snippet}
	</ResourceBoundary>
</section>
