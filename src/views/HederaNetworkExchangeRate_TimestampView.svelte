<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HederaNetworkExchangeRate_Timestamp>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaNetworkExchangeRate_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/exchange-rate/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
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
							currentRateCentEquivalent: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const currentRateCentEquivalent = entity.currentRateCentEquivalent}
					{#if currentRateCentEquivalent != null}
						<div>
							<dt>current rate cent equivalent</dt>
							<dd>
								{currentRateCentEquivalent}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							currentRateHbarEquivalent: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const currentRateHbarEquivalent = entity.currentRateHbarEquivalent}
					{#if currentRateHbarEquivalent != null}
						<div>
							<dt>current rate HBAR equivalent</dt>
							<dd>
								{currentRateHbarEquivalent}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							currentRateExpirationTime: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const currentRateExpirationTime = entity.currentRateExpirationTime}
					{#if currentRateExpirationTime != null}
						<div>
							<dt>current rate expiration time</dt>
							<dd>
								{currentRateExpirationTime}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nextRateCentEquivalent: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nextRateCentEquivalent = entity.nextRateCentEquivalent}
					{#if nextRateCentEquivalent != null}
						<div>
							<dt>next rate cent equivalent</dt>
							<dd>
								{nextRateCentEquivalent}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nextRateHbarEquivalent: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nextRateHbarEquivalent = entity.nextRateHbarEquivalent}
					{#if nextRateHbarEquivalent != null}
						<div>
							<dt>next rate HBAR equivalent</dt>
							<dd>
								{nextRateHbarEquivalent}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nextRateExpirationTime: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nextRateExpirationTime = entity.nextRateExpirationTime}
					{#if nextRateExpirationTime != null}
						<div>
							<dt>next rate expiration time</dt>
							<dd>
								{nextRateExpirationTime}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
