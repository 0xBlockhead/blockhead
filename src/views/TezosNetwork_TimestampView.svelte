<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.TezosNetwork_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'tezos network timestamp'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosNetworkView from '$/views/TezosNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		tezos network timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<TezosNetworkView
						selection={select(EntityType.TezosNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestLevel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestLevel = entity.latestLevel}
					{#if latestLevel != null}
						<div>
							<dt>latest level</dt>
							<dd>
								{String(latestLevel)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							protocolHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const protocolHash = entity.protocolHash}
					{#if protocolHash != null}
						<div>
							<dt>protocol hash</dt>
							<dd>
								<TruncatedValue value={protocolHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							cycle: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cycle = entity.cycle}
					{#if cycle != null}
						<div>
							<dt>cycle</dt>
							<dd>
								{String(cycle)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalSupplyMutez: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalSupplyMutez = entity.totalSupplyMutez}
					{#if totalSupplyMutez != null}
						<div>
							<dt>total supply mutez</dt>
							<dd>
								{String(totalSupplyMutez)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							activeBakerCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const activeBakerCount = entity.activeBakerCount}
					{#if activeBakerCount != null}
						<div>
							<dt>active baker count</dt>
							<dd>
								{String(activeBakerCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							indexerLagBlocks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const indexerLagBlocks = entity.indexerLagBlocks}
					{#if indexerLagBlocks != null}
						<div>
							<dt>indexer lag blocks</dt>
							<dd>
								{String(indexerLagBlocks)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
