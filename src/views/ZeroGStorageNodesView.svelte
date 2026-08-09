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
	}: EntityListViewProps<EntityType.ZeroGStorageNode> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGStorageNode}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: zeroGStorageNode })}
		{@const zeroGStorageNodeSelector = zeroGStorageNode[EntityMetaKey.Selector]}
		{@const network = zeroGStorageNodeSelector.$network}
		<EntityView
			entityType={EntityType.ZeroGStorageNode}
			entitySelector={zeroGStorageNodeSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/storage-node/[nodeId=evmAddress]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						nodeId: zeroGStorageNodeSelector.nodeId,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
