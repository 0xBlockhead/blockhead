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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.HederaNetworkExchangeRate_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaNetworkExchangeRate_Timestamp}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
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
