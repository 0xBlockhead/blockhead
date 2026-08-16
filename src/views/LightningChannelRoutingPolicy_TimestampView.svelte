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
	}: Omit<EntitySelectionViewProps<EntityType.LightningChannelRoutingPolicy_Timestamp>, 'prefetched'> = $props()

	const channelTimestamp = $derived(selection.entitySelector.$channelTimestamp)
	const lightningChannelRoutingPolicyTimestamp = $derived(selection({
		fields: {
			feeRatePpm: true,
			disabled: true,
		},
	}))
	const titleFallback = 'Lightning channel routing policy'


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
</script>


<EntityView
	entityType={EntityType.LightningChannelRoutingPolicy_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/channels/[channelId=stringSegment]/(lightningChannel)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]/(lightningChannelTimestamp)/routing-policy/[publicKey=stringSegment]',
				{
					network: (
						'caip2' in channelTimestamp.$channel.$network ?
							caip2StringFromValue(channelTimestamp.$channel.$network.caip2)
						:
							channelTimestamp.$channel.$network.slug
					),
					channelId: channelTimestamp.$channel.channelId,
					timestampMs: String(channelTimestamp.timestampMs),
					source: channelTimestamp.source,
					publicKey: selection.entitySelector.$towardNode.publicKey,
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
		<LightningNodeView
			selection={select(EntityType.LightningNode, selection.entitySelector.$towardNode)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={lightningChannelRoutingPolicyTimestamp}>
			{#snippet children(entity)}
				{[String(entity.feeRatePpm ?? ''), String(entity.disabled ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={lightningChannelRoutingPolicyTimestamp}
			>
				{#snippet children(entity)}
					{@const feeRatePpm = entity.feeRatePpm}
					{#if feeRatePpm != null}
						<div>
							<dt>Fee rate ppm</dt>
							<dd>
								<NumberValue
									value={feeRatePpm}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeBaseMsat: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeBaseMsat = entity.feeBaseMsat}
					{#if feeBaseMsat != null}
						<div>
							<dt>Base fee</dt>
							<dd>
								<NumberValue
									value={feeBaseMsat}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timeLockDelta: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timeLockDelta = entity.timeLockDelta}
					{#if timeLockDelta != null}
						<div>
							<dt>CLTV delta</dt>
							<dd>
								<NumberValue
									value={timeLockDelta}
								/>
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
							minHtlcMsat: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const minHtlcMsat = entity.minHtlcMsat}
					{#if minHtlcMsat != null}
						<div>
							<dt>Min HTLC</dt>
							<dd>
								<NumberValue
									value={minHtlcMsat}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxHtlcMsat: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxHtlcMsat = entity.maxHtlcMsat}
					{#if maxHtlcMsat != null}
						<div>
							<dt>Max HTLC</dt>
							<dd>
								<NumberValue
									value={maxHtlcMsat}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={lightningChannelRoutingPolicyTimestamp}
			>
				{#snippet children(entity)}
					{@const disabled = entity.disabled}
					{#if disabled != null}
						<div>
							<dt>Disabled</dt>
							<dd>
								{disabled ? 'Yes' : 'No'}
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
								<Timestamp timestamp={updatedAtMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
