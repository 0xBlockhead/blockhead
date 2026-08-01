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
		id = 'UtxoAddresses-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.UtxoAddress> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UtxoAddress}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				address: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: utxoAddress })}
		{@const utxoAddressSelector = utxoAddress[EntityMetaKey.Selector]}
		{@const network = utxoAddressSelector.$network}
		<EntityView
			entityType={EntityType.UtxoAddress}
			entitySelector={utxoAddressSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						address: utxoAddressSelector.address,
					}
				)
			}
		>
			{#snippet Title()}
				{utxoAddressSelector.address || 'UTXO address'}
			{/snippet}

			{#snippet Value()}
				{utxoAddressSelector.address}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{utxoAddress.$network.name || (utxoAddressSelector.$network.caip2 == null ? '' : `${utxoAddressSelector.$network.caip2.namespace}:${utxoAddressSelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
