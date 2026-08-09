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
	}: EntityListViewProps<EntityType.TezosOperationGroup> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosOperationGroup}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosOperationGroup })}
		{@const tezosOperationGroupSelector = tezosOperationGroup[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TezosOperationGroup}
			entitySelector={tezosOperationGroupSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/operation-group/[operationHash=stringSegment]',
					{
						network: (
							'caip2' in tezosOperationGroupSelector.$network.$network ?
								caip2StringFromValue(tezosOperationGroupSelector.$network.$network.caip2)
							:
								tezosOperationGroupSelector.$network.$network.slug
						),
						operationHash: tezosOperationGroupSelector.operationHash,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
