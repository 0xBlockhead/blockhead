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
	}: Omit<EntitySelectionViewProps<EntityType.LightningChannel_Timestamp>, 'prefetched'> = $props()

	const channel = $derived(selection.entitySelector.$channel)


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import LightningChannelView from '$/views/LightningChannelView.svelte'
</script>


<EntityView
	entityType={EntityType.LightningChannel_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/channels/[channelId=stringSegment]/(lightningChannel)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in channel.$network ?
							caip2StringFromValue(channel.$network.caip2)
						:
							channel.$network.slug
					),
					channelId: channel.channelId,
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
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={
				selection({
					fields: {
						status: true,
						capacitySats: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{[(entity.status ?? ''), String(entity.capacitySats ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Channel</dt>
				<dd>
					<LightningChannelView
						selection={select(EntityType.LightningChannel, selection.entitySelector.$channel)}
						layout={EntityLayout.Value}
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
								{feeRatePpm}
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
								{updatedAtMs}
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
								{closingFeeSats}
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
								{closedAtMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
