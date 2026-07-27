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
	}: EntitySelectionViewProps<EntityType.LightningChannel_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const lightningChannelTimestamp = $derived(selection({
		fields: {
			status: true,
			capacitySats: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.timestampMs ?? '') || 'Lightning channel timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import LightningChannelView from '$/views/LightningChannelView.svelte'
</script>


<EntityView
	entityType={EntityType.LightningChannel_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={lightningChannelTimestamp}>
			{#snippet children(entity)}
				{[(entity.status ?? ''), String(entity.capacitySats ?? '')].filter(Boolean).join(' ') || String(pendingEntity.timestampMs) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Channel</dt>
				<dd>
					<LightningChannelView
						selection={select(EntityType.LightningChannel, selection.entitySelector.$channel)}
						layout={EntityLayout.Value}
						open={false}
					/>
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
							feeRatePpm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeRatePpm = entity.feeRatePpm}
					{#if feeRatePpm != null}
						<div>
							<dt>Fee rate ppm</dt>
							<dd>
								{String(feeRatePpm)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							updatedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const updatedAtMs = entity.updatedAtMs}
					{#if updatedAtMs != null}
						<div>
							<dt>Updated</dt>
							<dd>
								{String(updatedAtMs)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							closingTransactionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const closingTransactionId = entity.closingTransactionId}
					{#if closingTransactionId != null}
						<div>
							<dt>Closing transaction ID</dt>
							<dd>
								{closingTransactionId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							closingFeeSats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const closingFeeSats = entity.closingFeeSats}
					{#if closingFeeSats != null}
						<div>
							<dt>Closing fee sats</dt>
							<dd>
								{String(closingFeeSats)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							closingReason: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const closingReason = entity.closingReason}
					{#if closingReason != null}
						<div>
							<dt>Closing reason</dt>
							<dd>
								{closingReason}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							closedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const closedAtMs = entity.closedAtMs}
					{#if closedAtMs != null}
						<div>
							<dt>Closed</dt>
							<dd>
								{String(closedAtMs)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
