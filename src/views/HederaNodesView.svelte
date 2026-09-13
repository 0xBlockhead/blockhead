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
	}: EntityListViewProps<EntityType.HederaNode> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaNode}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaNode })}
		{@const hederaNodeSelector = hederaNode[EntityMetaKey.Selector]}
		{@const network = hederaNodeSelector.$network}
		<EntityView
			entityType={EntityType.HederaNode}
			entitySelector={hederaNodeSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/node/[nodeId=nonNegativeInteger]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						nodeId: String(hederaNodeSelector.nodeId),
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
