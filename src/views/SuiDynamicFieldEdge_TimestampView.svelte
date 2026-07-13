<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.SuiDynamicFieldEdge_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SuiDynamicFieldEdge_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const suiDynamicFieldEdgeTimestamp = $derived(selection({}))
	const titleFallback = $derived('Sui dynamic field edge timestamp')
	const viewDomId = $derived('sui-dynamic-field-edge-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SuiDynamicFieldEdgeView from '$/views/SuiDynamicFieldEdgeView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiDynamicFieldEdge_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={suiDynamicFieldEdgeTimestamp}>
			{#snippet Pending()}
				{title || 'Sui dynamic field edge timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>edge</dt>
				<dd>
					<SuiDynamicFieldEdgeView
						selection={select(EntityType.SuiDynamicFieldEdge, selection.entitySelector.$edge, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>checkpoint sequence</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									checkpointSequence: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const checkpointSequence = pendingEntity.checkpointSequence}
							{#if checkpointSequence !== undefined && checkpointSequence !== null}
								{String((checkpointSequence) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const checkpointSequence = resolvedEntity.checkpointSequence}
							{#if checkpointSequence !== undefined && checkpointSequence !== null}
								{String((checkpointSequence) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
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
				{#snippet Pending()}
					{@const timestampMs = pendingEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
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
				{#snippet Pending()}
					{@const fieldType = pendingEntity.fieldType}
					{#if fieldType !== undefined && fieldType !== null}
						<div>
							<dt>field type</dt>
							<dd>
								{String((fieldType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fieldType = resolvedEntity.fieldType}
					{#if fieldType !== undefined && fieldType !== null}
						<div>
							<dt>field type</dt>
							<dd>
								{String((fieldType) ?? '')}
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
				{#snippet Pending()}
					{@const childObjectType = pendingEntity.childObjectType}
					{#if childObjectType !== undefined && childObjectType !== null}
						<div>
							<dt>child object type</dt>
							<dd>
								{String((childObjectType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const childObjectType = resolvedEntity.childObjectType}
					{#if childObjectType !== undefined && childObjectType !== null}
						<div>
							<dt>child object type</dt>
							<dd>
								{String((childObjectType) ?? '')}
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
				{#snippet Pending()}
					{@const deleted = pendingEntity.deleted}
					{#if deleted !== undefined && deleted !== null}
						<div>
							<dt>deleted</dt>
							<dd>
								{deleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deleted = resolvedEntity.deleted}
					{#if deleted !== undefined && deleted !== null}
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
