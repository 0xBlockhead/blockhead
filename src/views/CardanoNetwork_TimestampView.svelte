<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.CardanoNetwork_Timestamp>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'Cardano network timestamp'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestSlot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestSlot = entity.latestSlot}
					{#if latestSlot != null}
						<div>
							<dt>Latest slot</dt>
							<dd>
								{latestSlot}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestBlockNo: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestBlockNo = entity.latestBlockNo}
					{#if latestBlockNo != null}
						<div>
							<dt>Latest block number</dt>
							<dd>
								{latestBlockNo}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestBlockHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestBlockHash = entity.latestBlockHash}
					{#if latestBlockHash != null}
						<div>
							<dt>Latest block hash</dt>
							<dd>
								<TruncatedValue value={latestBlockHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestBlockTimeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestBlockTimeMs = entity.latestBlockTimeMs}
					{#if latestBlockTimeMs != null}
						<div>
							<dt>Latest block time</dt>
							<dd>
								{latestBlockTimeMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestBlockTransactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestBlockTransactionCount = entity.latestBlockTransactionCount}
					{#if latestBlockTransactionCount != null}
						<div>
							<dt>Latest block transactions</dt>
							<dd>
								{latestBlockTransactionCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							epoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const epoch = entity.epoch}
					{#if epoch != null}
						<div>
							<dt>Epoch</dt>
							<dd>
								{epoch}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							epochBlockCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const epochBlockCount = entity.epochBlockCount}
					{#if epochBlockCount != null}
						<div>
							<dt>Epoch blocks</dt>
							<dd>
								{epochBlockCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							epochTransactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const epochTransactionCount = entity.epochTransactionCount}
					{#if epochTransactionCount != null}
						<div>
							<dt>Epoch transactions</dt>
							<dd>
								{epochTransactionCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							circulatingSupplyLovelace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const circulatingSupplyLovelace = entity.circulatingSupplyLovelace}
					{#if circulatingSupplyLovelace != null}
						<div>
							<dt>Circulating supply</dt>
							<dd>
								{circulatingSupplyLovelace}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalSupplyLovelace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalSupplyLovelace = entity.totalSupplyLovelace}
					{#if totalSupplyLovelace != null}
						<div>
							<dt>Total supply</dt>
							<dd>
								{totalSupplyLovelace}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							liveStakeLovelace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const liveStakeLovelace = entity.liveStakeLovelace}
					{#if liveStakeLovelace != null}
						<div>
							<dt>Live stake</dt>
							<dd>
								{liveStakeLovelace}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							activeStakeLovelace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const activeStakeLovelace = entity.activeStakeLovelace}
					{#if activeStakeLovelace != null}
						<div>
							<dt>Active stake</dt>
							<dd>
								{activeStakeLovelace}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							backendHealthy: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const backendHealthy = entity.backendHealthy}
					{#if backendHealthy != null}
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
