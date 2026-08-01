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
	}: EntitySelectionViewProps<EntityType.SuiDynamicFieldEdge_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SuiDynamicFieldEdgeView from '$/views/SuiDynamicFieldEdgeView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiDynamicFieldEdge_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'Sui dynamic field edge timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
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
