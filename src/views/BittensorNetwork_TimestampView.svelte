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
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.BittensorNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BittensorNetwork_Timestamp>>
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
	const bittensorNetworkTimestamp = $derived(selection({
		sources: [
			Source.Bittensor_JsonRpc,
		],
		fields: {
			finalizedBlockNumber: true,
			runtimeSpecName: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Bittensor network observation')
	const viewDomId = $derived('bittensor-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BittensorNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bittensorNetworkTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bittensorNetworkTimestamp}>
			{#snippet Pending()}
				{@const finalizedBlockNumber0 = prefetched.finalizedBlockNumber}
				{#if finalizedBlockNumber0 !== undefined && finalizedBlockNumber0 !== null}
					<NumberValue value={Number(finalizedBlockNumber0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const finalizedBlockNumber0 = resolvedEntity.finalizedBlockNumber}
				{#if finalizedBlockNumber0 !== undefined && finalizedBlockNumber0 !== null}
					<NumberValue value={Number(finalizedBlockNumber0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={bittensorNetworkTimestamp}>
			{#snippet Pending()}
				{@const runtimeSpecName0 = prefetched.runtimeSpecName}
				{#if runtimeSpecName0 !== undefined && runtimeSpecName0 !== null}
					<span data-text="muted">
						{String((runtimeSpecName0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const runtimeSpecName0 = resolvedEntity.runtimeSpecName}
				{#if runtimeSpecName0 !== undefined && runtimeSpecName0 !== null}
					<span data-text="muted">
						{String((runtimeSpecName0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A point-in-time runtime and subsystem observation for a Bittensor network.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
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
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

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
								<NumberValue value={Number(finalizedBlockNumber)} />
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
								<NumberValue value={Number(finalizedBlockNumber)} />
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
		</dl>

		<dl data-column-item="center">
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
							<dt>Runtime spec</dt>
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
							<dt>Runtime spec</dt>
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
								<NumberValue value={Number(runtimeSpecVersion)} />
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
								<NumberValue value={Number(runtimeSpecVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							runtimeImplVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const runtimeImplVersion = prefetched.runtimeImplVersion}
					{#if runtimeImplVersion !== undefined && runtimeImplVersion !== null}
						<div>
							<dt>Runtime implementation version</dt>
							<dd>
								<NumberValue value={Number(runtimeImplVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const runtimeImplVersion = resolvedEntity.runtimeImplVersion}
					{#if runtimeImplVersion !== undefined && runtimeImplVersion !== null}
						<div>
							<dt>Runtime implementation version</dt>
							<dd>
								<NumberValue value={Number(runtimeImplVersion)} />
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
								<NumberValue value={Number(peerCount)} />
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
								<NumberValue value={Number(peerCount)} />
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							subnetCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const subnetCount = prefetched.subnetCount}
					{#if subnetCount !== undefined && subnetCount !== null}
						<div>
							<dt>Subnets</dt>
							<dd>
								<NumberValue value={Number(subnetCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const subnetCount = resolvedEntity.subnetCount}
					{#if subnetCount !== undefined && subnetCount !== null}
						<div>
							<dt>Subnets</dt>
							<dd>
								<NumberValue value={Number(subnetCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							subnetsInfoByteLength: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const subnetsInfoByteLength = prefetched.subnetsInfoByteLength}
					{#if subnetsInfoByteLength !== undefined && subnetsInfoByteLength !== null}
						<div>
							<dt>Subnet info bytes</dt>
							<dd>
								<NumberValue value={Number(subnetsInfoByteLength)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const subnetsInfoByteLength = resolvedEntity.subnetsInfoByteLength}
					{#if subnetsInfoByteLength !== undefined && subnetsInfoByteLength !== null}
						<div>
							<dt>Subnet info bytes</dt>
							<dd>
								<NumberValue value={Number(subnetsInfoByteLength)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							dynamicInfoByteLength: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const dynamicInfoByteLength = prefetched.dynamicInfoByteLength}
					{#if dynamicInfoByteLength !== undefined && dynamicInfoByteLength !== null}
						<div>
							<dt>Dynamic info bytes</dt>
							<dd>
								<NumberValue value={Number(dynamicInfoByteLength)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const dynamicInfoByteLength = resolvedEntity.dynamicInfoByteLength}
					{#if dynamicInfoByteLength !== undefined && dynamicInfoByteLength !== null}
						<div>
							<dt>Dynamic info bytes</dt>
							<dd>
								<NumberValue value={Number(dynamicInfoByteLength)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							metagraphsByteLength: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const metagraphsByteLength = prefetched.metagraphsByteLength}
					{#if metagraphsByteLength !== undefined && metagraphsByteLength !== null}
						<div>
							<dt>Metagraph bytes</dt>
							<dd>
								<NumberValue value={Number(metagraphsByteLength)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const metagraphsByteLength = resolvedEntity.metagraphsByteLength}
					{#if metagraphsByteLength !== undefined && metagraphsByteLength !== null}
						<div>
							<dt>Metagraph bytes</dt>
							<dd>
								<NumberValue value={Number(metagraphsByteLength)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
