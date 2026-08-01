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


	// Components
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiObjectView from '$/views/SuiObjectView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiDynamicFieldEdge}
	entitySelector={selection.entitySelector}
	title={title ?? 'Sui dynamic field edge'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>parent object</dt>
				<dd>
					<SuiObjectView
						selection={select(EntityType.SuiObject, selection.entitySelector.$parentObject)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>field name hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.fieldNameHash} />
				</dd>
			</div>

			<div>
				<dt>child object ID</dt>
				<dd>
					{selection.entitySelector.childObjectId}
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
