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
	}: EntityListViewProps<EntityType.TezosContract> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosContract}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosContract })}
		{@const tezosContractSelector = tezosContract[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TezosContract}
			entitySelector={tezosContractSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/contract/tezos/[address=stringSegment]',
					{
						network: (
							'caip2' in tezosContractSelector.$network.$network ?
								caip2StringFromValue(tezosContractSelector.$network.$network.caip2)
							:
								tezosContractSelector.$network.$network.slug
						),
						address: tezosContractSelector.address,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
