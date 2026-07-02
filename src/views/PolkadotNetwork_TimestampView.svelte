<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.PolkadotNetwork_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const polkadotNetworkTimestamp = $derived(selection({
		fields: {
			runtimeSpecName: true,
			finalizedBlockNumber: true,
			isSyncing: true,
			peerCount: true,
			runtimeSpecVersion: true,
			transactionVersion: true,
			stateVersion: true,
			finalizedBlockHash: true,
			finalizedExtrinsicCount: true,
			shouldHavePeers: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).runtimeSpecName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || 'Polkadot network timestamp')
	const viewDomId = $derived('polkadot-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/observation/[timestampMs=nonNegativeInteger]/[source]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).$network.slug),
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
			source: String(({ ...selection.entitySelector, ...prefetched }).source),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).runtimeSpecName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot network timestamp'}
		{:else}
			<ResourceBoundary resource={polkadotNetworkTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).runtimeSpecName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot network timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.runtimeSpecName) ?? ''), String((entity.source) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).finalizedBlockNumber) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).runtimeSpecName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot network timestamp'}
		{:else}
			<ResourceBoundary resource={polkadotNetworkTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).finalizedBlockNumber) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).runtimeSpecName) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot network timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.finalizedBlockNumber) ?? '')].filter(Boolean).join(' ') || [String((entity.runtimeSpecName) ?? ''), String((entity.source) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const isSyncing0 = prefetched.isSyncing}
			{#if isSyncing0 !== undefined && isSyncing0 !== null}
				<span data-text="muted">
					{String((isSyncing0) ?? '')}
				</span>
			{/if}
			{@const peerCount1 = prefetched.peerCount}
			{#if peerCount1 !== undefined && peerCount1 !== null}
				<span data-text="muted">
					{String((peerCount1) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={polkadotNetworkTimestamp}>
				{#snippet Pending()}
					{@const isSyncing0 = prefetched.isSyncing}
					{#if isSyncing0 !== undefined && isSyncing0 !== null}
						<span data-text="muted">
							{String((isSyncing0) ?? '')}
						</span>
					{/if}
					{@const peerCount1 = prefetched.peerCount}
					{#if peerCount1 !== undefined && peerCount1 !== null}
						<span data-text="muted">
							{String((peerCount1) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const isSyncing0 = entity.isSyncing}
					{#if isSyncing0 !== undefined && isSyncing0 !== null}
						<span data-text="muted">
							{String((isSyncing0) ?? '')}
						</span>
					{/if}
					{@const peerCount1 = entity.peerCount}
					{#if peerCount1 !== undefined && peerCount1 !== null}
						<span data-text="muted">
							{String((peerCount1) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary resource={polkadotNetworkTimestamp}>
						{#snippet Pending()}
							{@const timestampMs = prefetched.timestampMs ?? selection.entitySelector.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								{String((timestampMs) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const timestampMs = entity.timestampMs ?? selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								{String((timestampMs) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={polkadotNetworkTimestamp}>
				{#snippet Pending()}
					{@const runtimeSpecVersion = prefetched.runtimeSpecVersion ?? selection.entitySelector.runtimeSpecVersion}
					{#if runtimeSpecVersion !== undefined && runtimeSpecVersion !== null}
						<div>
							<dt>Runtime spec version</dt>
							<dd>
								{String((runtimeSpecVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const runtimeSpecVersion = entity.runtimeSpecVersion ?? selection.entitySelector.runtimeSpecVersion ?? prefetched.runtimeSpecVersion}
					{#if runtimeSpecVersion !== undefined && runtimeSpecVersion !== null}
						<div>
							<dt>Runtime spec version</dt>
							<dd>
								{String((runtimeSpecVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={polkadotNetworkTimestamp}>
				{#snippet Pending()}
					{@const transactionVersion = prefetched.transactionVersion ?? selection.entitySelector.transactionVersion}
					{#if transactionVersion !== undefined && transactionVersion !== null}
						<div>
							<dt>Transaction version</dt>
							<dd>
								{String((transactionVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const transactionVersion = entity.transactionVersion ?? selection.entitySelector.transactionVersion ?? prefetched.transactionVersion}
					{#if transactionVersion !== undefined && transactionVersion !== null}
						<div>
							<dt>Transaction version</dt>
							<dd>
								{String((transactionVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={polkadotNetworkTimestamp}>
				{#snippet Pending()}
					{@const stateVersion = prefetched.stateVersion ?? selection.entitySelector.stateVersion}
					{#if stateVersion !== undefined && stateVersion !== null}
						<div>
							<dt>State version</dt>
							<dd>
								{String((stateVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const stateVersion = entity.stateVersion ?? selection.entitySelector.stateVersion ?? prefetched.stateVersion}
					{#if stateVersion !== undefined && stateVersion !== null}
						<div>
							<dt>State version</dt>
							<dd>
								{String((stateVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={polkadotNetworkTimestamp}>
				{#snippet Pending()}
					{@const finalizedBlockHash = prefetched.finalizedBlockHash ?? selection.entitySelector.finalizedBlockHash}
					{#if finalizedBlockHash !== undefined && finalizedBlockHash !== null}
						<div>
							<dt>Finalized block hash</dt>
							<dd>
								{String((finalizedBlockHash) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const finalizedBlockHash = entity.finalizedBlockHash ?? selection.entitySelector.finalizedBlockHash ?? prefetched.finalizedBlockHash}
					{#if finalizedBlockHash !== undefined && finalizedBlockHash !== null}
						<div>
							<dt>Finalized block hash</dt>
							<dd>
								{String((finalizedBlockHash) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={polkadotNetworkTimestamp}>
				{#snippet Pending()}
					{@const finalizedExtrinsicCount = prefetched.finalizedExtrinsicCount ?? selection.entitySelector.finalizedExtrinsicCount}
					{#if finalizedExtrinsicCount !== undefined && finalizedExtrinsicCount !== null}
						<div>
							<dt>Finalized extrinsics</dt>
							<dd>
								{String((finalizedExtrinsicCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const finalizedExtrinsicCount = entity.finalizedExtrinsicCount ?? selection.entitySelector.finalizedExtrinsicCount ?? prefetched.finalizedExtrinsicCount}
					{#if finalizedExtrinsicCount !== undefined && finalizedExtrinsicCount !== null}
						<div>
							<dt>Finalized extrinsics</dt>
							<dd>
								{String((finalizedExtrinsicCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={polkadotNetworkTimestamp}>
				{#snippet Pending()}
					{@const shouldHavePeers = prefetched.shouldHavePeers ?? selection.entitySelector.shouldHavePeers}
					{#if shouldHavePeers !== undefined && shouldHavePeers !== null}
						<div>
							<dt>Should have peers</dt>
							<dd>
								{String((shouldHavePeers) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const shouldHavePeers = entity.shouldHavePeers ?? selection.entitySelector.shouldHavePeers ?? prefetched.shouldHavePeers}
					{#if shouldHavePeers !== undefined && shouldHavePeers !== null}
						<div>
							<dt>Should have peers</dt>
							<dd>
								{String((shouldHavePeers) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
							}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
