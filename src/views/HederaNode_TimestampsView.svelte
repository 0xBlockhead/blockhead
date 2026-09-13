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
	}: EntityListViewProps<EntityType.HederaNode_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaNode_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaNodeTimestamp })}
		{@const hederaNodeTimestampSelector = hederaNodeTimestamp[EntityMetaKey.Selector]}
		{@const node = hederaNodeTimestampSelector.$node}
		<EntityView
			entityType={EntityType.HederaNode_Timestamp}
			entitySelector={hederaNodeTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/node/[nodeId=nonNegativeInteger]/(hederaNode)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							node.$network.caip2 !== undefined ?
								caip2StringFromValue(node.$network.caip2)
							:
								node.$network.slug
						),
						nodeId: String(node.nodeId),
						timestampMs: String(hederaNodeTimestampSelector.timestampMs),
						source: hederaNodeTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
