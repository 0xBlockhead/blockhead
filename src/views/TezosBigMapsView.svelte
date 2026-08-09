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
	}: EntityListViewProps<EntityType.TezosBigMap> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosBigMap}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosBigMap })}
		{@const tezosBigMapSelector = tezosBigMap[EntityMetaKey.Selector]}
		{@const contract = tezosBigMapSelector.$contract}
		<EntityView
			entityType={EntityType.TezosBigMap}
			entitySelector={tezosBigMapSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/contract/tezos/[address=stringSegment]/(tezosContract)/big-map/[bigMapId=nonNegativeBigInt]',
					{
						network: (
							'caip2' in contract.$network.$network ?
								caip2StringFromValue(contract.$network.$network.caip2)
							:
								contract.$network.$network.slug
						),
						address: contract.address,
						bigMapId: String(tezosBigMapSelector.bigMapId),
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
