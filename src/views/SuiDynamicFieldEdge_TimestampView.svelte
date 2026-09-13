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
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.SuiDynamicFieldEdge_Timestamp>, 'prefetched'> = $props()

	const edge = $derived(selection.entitySelector.$edge)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SuiDynamicFieldEdgeView from '$/views/SuiDynamicFieldEdgeView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiDynamicFieldEdge_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'Sui dynamic field edge timestamp'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/object/[objectId=stringSegment]/(suiObject)/dynamic-field/[fieldNameHash=stringSegment]/[childObjectId=stringSegment]/(suiDynamicFieldEdge)/checkpoint/[checkpointSequence=nonNegativeBigInt]/[source=stringSegment]',
				{
					network: (
						edge.$parentObject.$network.$network.caip2 !== undefined ?
							caip2StringFromValue(edge.$parentObject.$network.$network.caip2)
						:
							edge.$parentObject.$network.$network.slug
					),
					objectId: edge.$parentObject.objectId,
					fieldNameHash: edge.fieldNameHash,
					childObjectId: edge.childObjectId,
					checkpointSequence: String(selection.entitySelector.checkpointSequence),
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
				<dt>edge</dt>
				<dd>
					<SuiDynamicFieldEdgeView
						selection={select(EntityType.SuiDynamicFieldEdge, selection.entitySelector.$edge)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>checkpoint sequence</dt>
				<dd>
					{selection.entitySelector.checkpointSequence}
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
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fieldType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fieldType = entity.fieldType}
					{#if fieldType != null}
						<div>
							<dt>field type</dt>
							<dd>
								{fieldType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							childObjectType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const childObjectType = entity.childObjectType}
					{#if childObjectType != null}
						<div>
							<dt>child object type</dt>
							<dd>
								{childObjectType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							deleted: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deleted = entity.deleted}
					{#if deleted != null}
						<div>
							<dt>deleted</dt>
							<dd>
								{deleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
