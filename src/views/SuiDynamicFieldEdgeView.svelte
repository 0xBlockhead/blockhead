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
	}: EntitySelectionViewProps<EntityType.SuiDynamicFieldEdge> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'Sui dynamic field edge'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiObjectView from '$/views/SuiObjectView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiDynamicFieldEdge}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		Sui dynamic field edge
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>parent object</dt>
				<dd>
					<SuiObjectView
						selection={select(EntityType.SuiObject, selection.entitySelector.$parentObject)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>field name hash</dt>
				<dd>
					<TruncatedValue value={pendingEntity.fieldNameHash} />
				</dd>
			</div>

			<div>
				<dt>child object ID</dt>
				<dd>
					{pendingEntity.childObjectId}
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
