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
		id = 'KaspaAddresses-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.KaspaAddress> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.KaspaAddress}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: kaspaAddress })}
		{@const kaspaAddressSelector = kaspaAddress[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.KaspaAddress}
			entitySelector={kaspaAddressSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[address=stringSegment]',
					{
						network: (
							kaspaAddressSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(kaspaAddressSelector.$network.$network.caip2)
							:
								kaspaAddressSelector.$network.$network.slug
						),
						address: kaspaAddressSelector.address,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
