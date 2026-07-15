<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.CardanoNetwork_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.CardanoNetwork_Timestamp>>
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
	const cardanoNetworkTimestamp = $derived(selection({}))
	const titleFallback = $derived('Cardano network timestamp')
	const viewDomId = $derived('cardano-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cardanoNetworkTimestamp}>
			{#snippet Pending()}
				{title || 'Cardano network timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
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
							{@const timestampMs = pendingEntity.timestampMs}
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
							{@const source = pendingEntity.source}
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
						sources: [
							Source.Blockfrost_Rest,
						],
						fields: {
							latestSlot: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestSlot = pendingEntity.latestSlot}
					{#if latestSlot !== undefined && latestSlot !== null}
						<div>
							<dt>Latest slot</dt>
							<dd>
								{String((latestSlot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestSlot = resolvedEntity.latestSlot}
					{#if latestSlot !== undefined && latestSlot !== null}
						<div>
							<dt>Latest slot</dt>
							<dd>
								{String((latestSlot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Blockfrost_Rest,
						],
						fields: {
							latestBlockNo: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestBlockNo = pendingEntity.latestBlockNo}
					{#if latestBlockNo !== undefined && latestBlockNo !== null}
						<div>
							<dt>Latest block number</dt>
							<dd>
								{String((latestBlockNo) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestBlockNo = resolvedEntity.latestBlockNo}
					{#if latestBlockNo !== undefined && latestBlockNo !== null}
						<div>
							<dt>Latest block number</dt>
							<dd>
								{String((latestBlockNo) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Blockfrost_Rest,
						],
						fields: {
							latestBlockHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestBlockHash = pendingEntity.latestBlockHash}
					{#if latestBlockHash !== undefined && latestBlockHash !== null}
						<div>
							<dt>Latest block hash</dt>
							<dd>
								<TruncatedValue value={String((latestBlockHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestBlockHash = resolvedEntity.latestBlockHash}
					{#if latestBlockHash !== undefined && latestBlockHash !== null}
						<div>
							<dt>Latest block hash</dt>
							<dd>
								<TruncatedValue value={String((latestBlockHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Blockfrost_Rest,
						],
						fields: {
							latestBlockTimeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestBlockTimeMs = pendingEntity.latestBlockTimeMs}
					{#if latestBlockTimeMs !== undefined && latestBlockTimeMs !== null}
						<div>
							<dt>Latest block time</dt>
							<dd>
								{String((latestBlockTimeMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestBlockTimeMs = resolvedEntity.latestBlockTimeMs}
					{#if latestBlockTimeMs !== undefined && latestBlockTimeMs !== null}
						<div>
							<dt>Latest block time</dt>
							<dd>
								{String((latestBlockTimeMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Blockfrost_Rest,
						],
						fields: {
							latestBlockTransactionCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestBlockTransactionCount = pendingEntity.latestBlockTransactionCount}
					{#if latestBlockTransactionCount !== undefined && latestBlockTransactionCount !== null}
						<div>
							<dt>Latest block transactions</dt>
							<dd>
								{String((latestBlockTransactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestBlockTransactionCount = resolvedEntity.latestBlockTransactionCount}
					{#if latestBlockTransactionCount !== undefined && latestBlockTransactionCount !== null}
						<div>
							<dt>Latest block transactions</dt>
							<dd>
								{String((latestBlockTransactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Blockfrost_Rest,
						],
						fields: {
							epoch: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const epoch = pendingEntity.epoch}
					{#if epoch !== undefined && epoch !== null}
						<div>
							<dt>Epoch</dt>
							<dd>
								{String((epoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const epoch = resolvedEntity.epoch}
					{#if epoch !== undefined && epoch !== null}
						<div>
							<dt>Epoch</dt>
							<dd>
								{String((epoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Blockfrost_Rest,
						],
						fields: {
							epochBlockCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const epochBlockCount = pendingEntity.epochBlockCount}
					{#if epochBlockCount !== undefined && epochBlockCount !== null}
						<div>
							<dt>Epoch blocks</dt>
							<dd>
								{String((epochBlockCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const epochBlockCount = resolvedEntity.epochBlockCount}
					{#if epochBlockCount !== undefined && epochBlockCount !== null}
						<div>
							<dt>Epoch blocks</dt>
							<dd>
								{String((epochBlockCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Blockfrost_Rest,
						],
						fields: {
							epochTransactionCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const epochTransactionCount = pendingEntity.epochTransactionCount}
					{#if epochTransactionCount !== undefined && epochTransactionCount !== null}
						<div>
							<dt>Epoch transactions</dt>
							<dd>
								{String((epochTransactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const epochTransactionCount = resolvedEntity.epochTransactionCount}
					{#if epochTransactionCount !== undefined && epochTransactionCount !== null}
						<div>
							<dt>Epoch transactions</dt>
							<dd>
								{String((epochTransactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Blockfrost_Rest,
						],
						fields: {
							circulatingSupplyLovelace: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const circulatingSupplyLovelace = pendingEntity.circulatingSupplyLovelace}
					{#if circulatingSupplyLovelace !== undefined && circulatingSupplyLovelace !== null}
						<div>
							<dt>Circulating supply</dt>
							<dd>
								{String((circulatingSupplyLovelace) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const circulatingSupplyLovelace = resolvedEntity.circulatingSupplyLovelace}
					{#if circulatingSupplyLovelace !== undefined && circulatingSupplyLovelace !== null}
						<div>
							<dt>Circulating supply</dt>
							<dd>
								{String((circulatingSupplyLovelace) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Blockfrost_Rest,
						],
						fields: {
							totalSupplyLovelace: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalSupplyLovelace = pendingEntity.totalSupplyLovelace}
					{#if totalSupplyLovelace !== undefined && totalSupplyLovelace !== null}
						<div>
							<dt>Total supply</dt>
							<dd>
								{String((totalSupplyLovelace) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalSupplyLovelace = resolvedEntity.totalSupplyLovelace}
					{#if totalSupplyLovelace !== undefined && totalSupplyLovelace !== null}
						<div>
							<dt>Total supply</dt>
							<dd>
								{String((totalSupplyLovelace) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Blockfrost_Rest,
						],
						fields: {
							liveStakeLovelace: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const liveStakeLovelace = pendingEntity.liveStakeLovelace}
					{#if liveStakeLovelace !== undefined && liveStakeLovelace !== null}
						<div>
							<dt>Live stake</dt>
							<dd>
								{String((liveStakeLovelace) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const liveStakeLovelace = resolvedEntity.liveStakeLovelace}
					{#if liveStakeLovelace !== undefined && liveStakeLovelace !== null}
						<div>
							<dt>Live stake</dt>
							<dd>
								{String((liveStakeLovelace) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Blockfrost_Rest,
						],
						fields: {
							activeStakeLovelace: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const activeStakeLovelace = pendingEntity.activeStakeLovelace}
					{#if activeStakeLovelace !== undefined && activeStakeLovelace !== null}
						<div>
							<dt>Active stake</dt>
							<dd>
								{String((activeStakeLovelace) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activeStakeLovelace = resolvedEntity.activeStakeLovelace}
					{#if activeStakeLovelace !== undefined && activeStakeLovelace !== null}
						<div>
							<dt>Active stake</dt>
							<dd>
								{String((activeStakeLovelace) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Blockfrost_Rest,
						],
						fields: {
							backendHealthy: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const backendHealthy = pendingEntity.backendHealthy}
					{#if backendHealthy !== undefined && backendHealthy !== null}
						<div>
							<dt>Backend healthy</dt>
							<dd>
								{backendHealthy ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const backendHealthy = resolvedEntity.backendHealthy}
					{#if backendHealthy !== undefined && backendHealthy !== null}
						<div>
							<dt>Backend healthy</dt>
							<dd>
								{backendHealthy ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
