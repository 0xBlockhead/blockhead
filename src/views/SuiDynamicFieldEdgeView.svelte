<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.SuiDynamicFieldEdge>, 'prefetched'> = $props()

	const parentObject = $derived(selection.entitySelector.$parentObject)


	// Components
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiObjectView from '$/views/SuiObjectView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiDynamicFieldEdge}
	entitySelector={selection.entitySelector}
	title={title ?? 'Sui dynamic field edge'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/object/[objectId=stringSegment]/(suiObject)/dynamic-field/[fieldNameHash=stringSegment]/[childObjectId=stringSegment]',
				{
					network: (
						'caip2' in parentObject.$network.$network ?
							caip2StringFromValue(parentObject.$network.$network.caip2)
						:
							parentObject.$network.$network.slug
					),
					objectId: parentObject.objectId,
					fieldNameHash: selection.entitySelector.fieldNameHash,
					childObjectId: selection.entitySelector.childObjectId,
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
