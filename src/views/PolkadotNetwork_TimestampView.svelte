<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'


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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const polkadotNetworkTimestamp = $derived(selection({
		fields: {
			runtimeSpecName: true,
			finalizedBlockNumber: true,
			isSyncing: true,
			peerCount: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.runtimeSpecName) ?? ''), String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || 'Polkadot network timestamp')
	const viewDomId = $derived('polkadot-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.namespace !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined && pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/observation/[timestampMs=nonNegativeInteger]/[source]', {
			networkSlug: String(networkByCaip2[String(String(pendingEntity.$network.caip2.namespace) + ':' + String(pendingEntity.$network.caip2.reference))].slug ?? ''),
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={polkadotNetworkTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.runtimeSpecName) ?? ''), String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot network timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.runtimeSpecName) ?? ''), String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={polkadotNetworkTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.finalizedBlockNumber) ?? '')].filter(Boolean).join(' ') || [String((prefetched.runtimeSpecName) ?? ''), String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot network timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.finalizedBlockNumber) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.runtimeSpecName) ?? ''), String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={polkadotNetworkTimestamp}>
			{#snippet Pending()}
				{@const isSyncing0 = prefetched.isSyncing}
				{#if isSyncing0 !== undefined && isSyncing0 !== null}
					<span data-text="muted">
						{isSyncing0 ? 'Yes' : 'No'}
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
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const isSyncing0 = resolvedEntity.isSyncing}
				{#if isSyncing0 !== undefined && isSyncing0 !== null}
					<span data-text="muted">
						{isSyncing0 ? 'Yes' : 'No'}
					</span>
				{/if}
				{@const peerCount1 = resolvedEntity.peerCount}
				{#if peerCount1 !== undefined && peerCount1 !== null}
					<span data-text="muted">
						{String((peerCount1) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							runtimeSpecName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const runtimeSpecName = prefetched.runtimeSpecName}
					{#if runtimeSpecName !== undefined && runtimeSpecName !== null}
						<div>
							<dt>Runtime spec name</dt>
							<dd>
								{String((runtimeSpecName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const runtimeSpecName = resolvedEntity.runtimeSpecName}
					{#if runtimeSpecName !== undefined && runtimeSpecName !== null}
						<div>
							<dt>Runtime spec name</dt>
							<dd>
								{String((runtimeSpecName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							runtimeSpecVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const runtimeSpecVersion = prefetched.runtimeSpecVersion}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const runtimeSpecVersion = resolvedEntity.runtimeSpecVersion}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionVersion = prefetched.transactionVersion}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionVersion = resolvedEntity.transactionVersion}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stateVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stateVersion = prefetched.stateVersion}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stateVersion = resolvedEntity.stateVersion}
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
			<ResourceBoundary
				resource={
					selection({
						fields: {
							finalizedBlockNumber: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const finalizedBlockNumber = prefetched.finalizedBlockNumber}
					{#if finalizedBlockNumber !== undefined && finalizedBlockNumber !== null}
						<div>
							<dt>Finalized block number</dt>
							<dd>
								{String((finalizedBlockNumber) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const finalizedBlockNumber = resolvedEntity.finalizedBlockNumber}
					{#if finalizedBlockNumber !== undefined && finalizedBlockNumber !== null}
						<div>
							<dt>Finalized block number</dt>
							<dd>
								{String((finalizedBlockNumber) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							finalizedBlockHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const finalizedBlockHash = prefetched.finalizedBlockHash}
					{#if finalizedBlockHash !== undefined && finalizedBlockHash !== null}
						<div>
							<dt>Finalized block hash</dt>
							<dd>
								<TruncatedValue value={String((finalizedBlockHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const finalizedBlockHash = resolvedEntity.finalizedBlockHash}
					{#if finalizedBlockHash !== undefined && finalizedBlockHash !== null}
						<div>
							<dt>Finalized block hash</dt>
							<dd>
								<TruncatedValue value={String((finalizedBlockHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							finalizedExtrinsicCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const finalizedExtrinsicCount = prefetched.finalizedExtrinsicCount}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const finalizedExtrinsicCount = resolvedEntity.finalizedExtrinsicCount}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							peerCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const peerCount = prefetched.peerCount}
					{#if peerCount !== undefined && peerCount !== null}
						<div>
							<dt>Peers</dt>
							<dd>
								{String((peerCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const peerCount = resolvedEntity.peerCount}
					{#if peerCount !== undefined && peerCount !== null}
						<div>
							<dt>Peers</dt>
							<dd>
								{String((peerCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isSyncing: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isSyncing = prefetched.isSyncing}
					{#if isSyncing !== undefined && isSyncing !== null}
						<div>
							<dt>Syncing</dt>
							<dd>
								{isSyncing ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isSyncing = resolvedEntity.isSyncing}
					{#if isSyncing !== undefined && isSyncing !== null}
						<div>
							<dt>Syncing</dt>
							<dd>
								{isSyncing ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							shouldHavePeers: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const shouldHavePeers = prefetched.shouldHavePeers}
					{#if shouldHavePeers !== undefined && shouldHavePeers !== null}
						<div>
							<dt>Should have peers</dt>
							<dd>
								{shouldHavePeers ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const shouldHavePeers = resolvedEntity.shouldHavePeers}
					{#if shouldHavePeers !== undefined && shouldHavePeers !== null}
						<div>
							<dt>Should have peers</dt>
							<dd>
								{shouldHavePeers ? 'Yes' : 'No'}
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
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
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
