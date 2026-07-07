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
			selection: EntityProxyResource<typeof schema, EntityType.SuiDynamicFieldEdge>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SuiDynamicFieldEdge>>
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
	const suiDynamicFieldEdge = $derived(selection({}))
	const titleFallback = $derived('Sui dynamic field edge')
	const viewDomId = $derived('sui-dynamic-field-edge-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiObjectView from '$/views/SuiObjectView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiDynamicFieldEdge}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={suiDynamicFieldEdge}>
			{#snippet Pending()}
				{title || 'Sui dynamic field edge'}
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
				<dt>parent object</dt>
				<dd>
					<SuiObjectView
						selection={select(EntityType.SuiObject, selection.entitySelector.$parentObject, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>field name hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									fieldNameHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const fieldNameHash = selection.entitySelector.fieldNameHash ?? prefetched.fieldNameHash}
							{#if fieldNameHash !== undefined && fieldNameHash !== null}
								<TruncatedValue value={String((fieldNameHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const fieldNameHash = resolvedEntity.fieldNameHash}
							{#if fieldNameHash !== undefined && fieldNameHash !== null}
								<TruncatedValue value={String((fieldNameHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>child object ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									childObjectId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const childObjectId = selection.entitySelector.childObjectId ?? prefetched.childObjectId}
							{#if childObjectId !== undefined && childObjectId !== null}
								{String((childObjectId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const childObjectId = resolvedEntity.childObjectId}
							{#if childObjectId !== undefined && childObjectId !== null}
								{String((childObjectId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
