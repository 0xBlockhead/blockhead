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
	}: EntityListViewProps<EntityType.TezosBigMapKey> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosBigMapKey}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosBigMapKey })}
		{@const tezosBigMapKeySelector = tezosBigMapKey[EntityMetaKey.Selector]}
		{@const bigMap = tezosBigMapKeySelector.$bigMap}
		<EntityView
			entityType={EntityType.TezosBigMapKey}
			entitySelector={tezosBigMapKeySelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/contract/tezos/[address=stringSegment]/(tezosContract)/big-map/[bigMapId=nonNegativeBigInt]/(tezosBigMap)/key/[keyHash=stringSegment]',
					{
						network: (
							'caip2' in bigMap.$contract.$network.$network ?
								caip2StringFromValue(bigMap.$contract.$network.$network.caip2)
							:
								bigMap.$contract.$network.$network.slug
						),
						address: bigMap.$contract.address,
						bigMapId: String(bigMap.bigMapId),
						keyHash: tezosBigMapKeySelector.keyHash,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
