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
	}: EntitySelectionViewProps<EntityType.LightningNetwork_Timestamp> = $props()

	const lightningNetworkTimestamp = $derived(selection({
		fields: {
			nodeCount: true,
			channelCount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import LightningNetworkView from '$/views/LightningNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.LightningNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={lightningNetworkTimestamp}>
			{#snippet children(entity)}
				{[String(entity.nodeCount ?? ''), String(entity.channelCount ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Lightning network</dt>
				<dd>
					<LightningNetworkView
						selection={select(EntityType.LightningNetwork, selection.entitySelector.$lightningNetwork)}
						layout={EntityLayout.Value}
						open={false}
					/>
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
							totalCapacitySats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalCapacitySats = entity.totalCapacitySats}
					{#if totalCapacitySats != null}
						<div>
							<dt>Total capacity sats</dt>
							<dd>
								{totalCapacitySats}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							torNodeCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const torNodeCount = entity.torNodeCount}
					{#if torNodeCount != null}
						<div>
							<dt>Tor nodes</dt>
							<dd>
								{torNodeCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							clearnetNodeCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const clearnetNodeCount = entity.clearnetNodeCount}
					{#if clearnetNodeCount != null}
						<div>
							<dt>Clearnet nodes</dt>
							<dd>
								{clearnetNodeCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							unannouncedNodeCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const unannouncedNodeCount = entity.unannouncedNodeCount}
					{#if unannouncedNodeCount != null}
						<div>
							<dt>Unannounced nodes</dt>
							<dd>
								{unannouncedNodeCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							averageCapacitySats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const averageCapacitySats = entity.averageCapacitySats}
					{#if averageCapacitySats != null}
						<div>
							<dt>Average capacity sats</dt>
							<dd>
								{averageCapacitySats}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							medianCapacitySats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const medianCapacitySats = entity.medianCapacitySats}
					{#if medianCapacitySats != null}
						<div>
							<dt>Median capacity sats</dt>
							<dd>
								{medianCapacitySats}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							averageFeeRatePpm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const averageFeeRatePpm = entity.averageFeeRatePpm}
					{#if averageFeeRatePpm != null}
						<div>
							<dt>Average fee rate ppm</dt>
							<dd>
								{averageFeeRatePpm}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							medianFeeRatePpm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const medianFeeRatePpm = entity.medianFeeRatePpm}
					{#if medianFeeRatePpm != null}
						<div>
							<dt>Median fee rate ppm</dt>
							<dd>
								{medianFeeRatePpm}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
