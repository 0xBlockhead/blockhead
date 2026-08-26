<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.MevRelay_Timestamp>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MevRelayView from '$/views/MevRelayView.svelte'
</script>


<EntityView
	entityType={EntityType.MevRelay_Timestamp}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Relay</dt>
				<dd>
					<MevRelayView
						selection={select(EntityType.MevRelay, selection.entitySelector.$relay)}
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
							deliveredPayloadSampleCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deliveredPayloadSampleCount = entity.deliveredPayloadSampleCount}
					{#if deliveredPayloadSampleCount != null}
						<div>
							<dt>Delivered payload sample count</dt>
							<dd>
								{deliveredPayloadSampleCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							builderSampleCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const builderSampleCount = entity.builderSampleCount}
					{#if builderSampleCount != null}
						<div>
							<dt>Builder sample count</dt>
							<dd>
								{builderSampleCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							windowStartSlot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const windowStartSlot = entity.windowStartSlot}
					{#if windowStartSlot != null}
						<div>
							<dt>Window start slot</dt>
							<dd>
								{windowStartSlot}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							windowEndSlot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const windowEndSlot = entity.windowEndSlot}
					{#if windowEndSlot != null}
						<div>
							<dt>Window end slot</dt>
							<dd>
								{windowEndSlot}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sampleLimit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sampleLimit = entity.sampleLimit}
					{#if sampleLimit != null}
						<div>
							<dt>Sample limit</dt>
							<dd>
								{sampleLimit}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
