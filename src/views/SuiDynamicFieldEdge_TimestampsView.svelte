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
	}: EntityListViewProps<EntityType.SuiDynamicFieldEdge_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiDynamicFieldEdge_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiDynamicFieldEdgeTimestamp })}
		{@const suiDynamicFieldEdgeTimestampSelector = suiDynamicFieldEdgeTimestamp[EntityMetaKey.Selector]}
		{@const edge = suiDynamicFieldEdgeTimestampSelector.$edge}
		<EntityView
			entityType={EntityType.SuiDynamicFieldEdge_Timestamp}
			entitySelector={suiDynamicFieldEdgeTimestampSelector}
			href={
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
						checkpointSequence: String(suiDynamicFieldEdgeTimestampSelector.checkpointSequence),
						source: suiDynamicFieldEdgeTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				Sui dynamic field edge timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
