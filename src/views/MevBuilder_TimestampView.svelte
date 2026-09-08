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
	}: Omit<EntitySelectionViewProps<EntityType.MevBuilder_Timestamp>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MevBuilderView from '$/views/MevBuilderView.svelte'
</script>


<EntityView
	entityType={EntityType.MevBuilder_Timestamp}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Builder</dt>
				<dd>
					<MevBuilderView
						selection={select(EntityType.MevBuilder, selection.entitySelector.$builder)}
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
							deliveredPayloadCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deliveredPayloadCount = entity.deliveredPayloadCount}
					{#if deliveredPayloadCount != null}
						<div>
							<dt>Delivered payload count</dt>
							<dd>
								{deliveredPayloadCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							deliveredValueWei: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deliveredValueWei = entity.deliveredValueWei}
					{#if deliveredValueWei != null}
						<div>
							<dt>Delivered value</dt>
							<dd>
								{deliveredValueWei}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							relayCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const relayCount = entity.relayCount}
					{#if relayCount != null}
						<div>
							<dt>Relay count</dt>
							<dd>
								{relayCount}
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

			<div>
				<dt>Sample limit</dt>
				<dd>
					{selection.entitySelector.sampleLimit}
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
