<script lang="ts">
	// Types/constants
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
		select,
	} from '$/routes/+layout.svelte'


	let cachedBoundaryOpen = $state(
		true
	)

	const cachedQuery = {
		data: 'Cached value',
		isLoading: false,
		isError: false,
		isReady: true,
		status: 'ready',
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
	const selectedResource = new TanStackLiveQueryResource(
		() => liveQuery,
		(update) => {
			liveQueryListeners.add(update)
			return () => {
				liveQueryListeners.delete(update)
			}
		},
	)
	let directOnlyQuery = $state<TanStackLiveQuerySnapshot<string>>(initialLiveQuery)
	const directOnlyQueryListeners = new Set<() => void>()
	const directOnlyResource = new TanStackLiveQueryResource(
		() => directOnlyQuery,
		(update) => {
			directOnlyQueryListeners.add(update)
			return () => {
				directOnlyQueryListeners.delete(update)
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
	let showRealSelectedScalarResource = $state(false)
	let showRealSelectedResource = $state(false)
	let showRealSelectedCountResource = $state(false)
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
	const failedPromise = Promise.reject<string>(new Error('Boundary failure'))
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
	const realSelectedScalarResource = select(
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
	const realSelectedBoundaryOnlyResource = select(
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
	let realSelectedScalar = $derived(
		realSelectedScalarResource.current
	)
	const applySelectedValue = (
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

	const applySelectedLoading = () => {
		liveQuery.isLoading = true
		liveQuery.isError = false
		liveQuery.isReady = false
		liveQuery.error = undefined
		liveQuery.status = 'loading'
		for (const listener of liveQueryListeners)
			listener()
	}

	const applyDirectOnlyValue = (
		value: string,
	) => {
		directOnlyQuery.data = value
		directOnlyQuery.isLoading = false
		directOnlyQuery.isError = false
		directOnlyQuery.isReady = true
		directOnlyQuery.error = undefined
		directOnlyQuery.status = 'ready'
		for (const listener of directOnlyQueryListeners)
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
			<p data-testid="cached-boundary-value">{value}</p>
		{/snippet}
	</ResourceBoundary>
</Collapsible>

<section data-testid="selected-boundary-section">
	<h2>Selected boundary</h2>

	<button
		data-testid="resolve-selected-boundary"
		onclick={() => applySelectedValue('Selected value')}
	>
		Resolve selected boundary
	</button>

	<button
		data-testid="refresh-selected-boundary"
		onclick={applySelectedLoading}
	>
		Refresh selected boundary
	</button>

	<button
		data-testid="update-selected-boundary"
		onclick={() => applySelectedValue('Updated selected value')}
	>
		Update selected boundary
	</button>

	<p data-testid="selected-direct-current">{selectedResource.current ?? ''}</p>

	<ResourceBoundary
		resource={selectedResource}
		placeholderText="Loading selected value"
	>
		{#snippet children(value)}
			<p data-testid="selected-boundary-value">{value}</p>
		{/snippet}
	</ResourceBoundary>

	<ResourceBoundary
		resource={selectedResource}
		placeholderText="Loading selected duplicate value"
	>
		{#snippet children(value)}
			<p data-testid="selected-boundary-value-secondary">{value}</p>
		{/snippet}
	</ResourceBoundary>

	<svelte:boundary>
		<p data-testid="selected-awaited-value">{await selectedResource}</p>

		{#snippet pending()}
			<p data-testid="selected-awaited-value">pending</p>
		{/snippet}
	</svelte:boundary>
</section>

<section data-testid="failable-boundary-section">
	<h2>Failable TanStack resource boundary</h2>

	<button onclick={() => applyFailableValue('Failable value')}>
		Resolve failable boundary
	</button>

	<button
		data-testid="fail-failable-boundary"
		onclick={applyFailableError}
	>
		Fail failable boundary
	</button>

	<button
		data-testid="recover-failable-boundary"
		onclick={() => applyFailableValue('Recovered failable value')}
	>
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

<section data-testid="real-selection-boundary-section">
	<h2>Real selection boundary</h2>

	<button
		data-testid="show-real-selection-scalar-boundary"
		onclick={() => showRealSelectedScalarResource = true}
	>
		Show real selection scalar boundary
	</button>

	<button
		data-testid="show-real-selection-rows-boundary"
		onclick={() => showRealSelectedResource = true}
	>
		Show real selection rows boundary
	</button>

	<button
		data-testid="show-real-selection-count-boundary"
		onclick={() => showRealSelectedCountResource = true}
	>
		Show real selection count boundary
	</button>

	<button onclick={() => undefined}>
		Seed real selection scalar field
	</button>

	<button
		data-testid="update-real-selection-scalar-field"
		onclick={() => undefined}
	>
		Update real selection scalar field
	</button>

	<button onclick={() => undefined}>
		Seed boundary-only live subscription field
	</button>

	<button
		data-testid="update-boundary-only-live-subscription-field"
		onclick={() => undefined}
	>
		Update boundary-only live subscription field
	</button>

	<button
		data-testid="update-direct-only-live-subscription-field"
		onclick={() => applyDirectOnlyValue('Updated direct-only value')}
	>
		Update direct-only live subscription field
	</button>

	{#if showRealSelectedScalarResource}
		<p data-testid="real-resource-direct-scalars">
			{realSelectedScalar?.name ?? ''}:{realSelectedScalar?.status ?? ''}
		</p>

		<svelte:boundary>
			{@const value = await realSelectedScalarResource}

			<p data-testid="real-resource-awaited-scalars">{value.name}:{value.status}</p>

			{#snippet pending()}
				<p data-testid="real-resource-awaited-scalars">pending</p>
			{/snippet}
		</svelte:boundary>

		<ResourceBoundary
			resource={realSelectedScalarResource}
			placeholderText="Loading real selection scalar value"
		>
			{#snippet children(value)}
				<p data-testid="real-resource-boundary-scalars">{value.name}:{value.status}</p>
			{/snippet}
		</ResourceBoundary>
	{/if}

	<ResourceBoundary
		resource={realSelectedBoundaryOnlyResource}
		placeholderText="Loading real selection boundary-only resource"
	>
		{#snippet children(value)}
			<p data-testid="real-resource-boundary-only-scalars">{value.name}:{value.status}</p>
		{/snippet}
	</ResourceBoundary>

	<p data-testid="real-resource-direct-only-current">
		{directOnlyResource.current ?? ''}
	</p>

	<p data-testid="real-resource-direct-only-loading">
		{String(directOnlyResource.loading)}
	</p>

	<p data-testid="real-resource-direct-only-ready">
		{String(directOnlyResource.ready)}
	</p>

	<p data-testid="real-resource-direct-only-error">
		{directOnlyResource.error == null ? '' : String(directOnlyResource.error)}
	</p>

	{#if showRealSelectedResource}
		<ResourceBoundary
			resource={select(
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
				}
			)}
			placeholderText="Loading real selection value"
		>
			{#snippet children(value)}
				<p data-testid="real-resource-boundary-rows">{value.$$proposalKinds?.values.length ?? 0}</p>
			{/snippet}
		</ResourceBoundary>
	{/if}

	{#if showRealSelectedCountResource}
		<ResourceBoundary
			resource={select(
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
				}
			)}
			placeholderText="Loading real selection count"
		>
			{#snippet children(value)}
				<p data-testid="real-resource-boundary-count">
					{value.$$proposalKinds?.values.length ?? 0}:{value.$$proposalKinds?.totalCount ?? ''}
				</p>
			{/snippet}
		</ResourceBoundary>
	{/if}
</section>

<section data-testid="query-resource-boundary-section">
	<h2>SvelteKit query resource boundary</h2>

	<button
		data-testid="resolve-query-resource-boundary"
		onclick={() => applyQueryTaggedValue('Query tagged value')}
	>
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

<section data-testid="failed-resource-boundary-section">
	<h2>Failed resource boundary</h2>

	<button
		data-testid="show-failed-resource"
		onclick={() => showFailedResource = true}
	>
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

<section data-testid="remote-resource-boundary-section">
	<h2>Remote resource boundary</h2>

	<button
		data-testid="resolve-remote-boundary"
		onclick={() => applyRemoteValue('Remote selected value')}
	>
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
