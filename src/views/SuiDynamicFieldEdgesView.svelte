<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.SuiDynamicFieldEdge> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiDynamicFieldEdge}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiDynamicFieldEdge })}
		{@const suiDynamicFieldEdgeSelector = suiDynamicFieldEdge[EntityMetaKey.Selector]}
		{@const parentObject = suiDynamicFieldEdgeSelector.$parentObject}
		<EntityView
			entityType={EntityType.SuiDynamicFieldEdge}
			entitySelector={suiDynamicFieldEdgeSelector}
			href={
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
						fieldNameHash: suiDynamicFieldEdgeSelector.fieldNameHash,
						childObjectId: suiDynamicFieldEdgeSelector.childObjectId,
					}
				)
			}
		>
			{#snippet Title()}
				Sui dynamic field edge
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
