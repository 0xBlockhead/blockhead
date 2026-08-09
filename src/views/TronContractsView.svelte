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
	}: EntityListViewProps<EntityType.TronContract> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronContract}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tronContract })}
		{@const tronContractSelector = tronContract[EntityMetaKey.Selector]}
		{@const network = tronContractSelector.$network}
		<EntityView
			entityType={EntityType.TronContract}
			entitySelector={tronContractSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/contract/[address=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						address: tronContractSelector.address,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
