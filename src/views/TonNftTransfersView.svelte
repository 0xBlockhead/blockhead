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
	}: EntityListViewProps<EntityType.TonNftTransfer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonNftTransfer}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonNftTransfer })}
		{@const tonNftTransferSelector = tonNftTransfer[EntityMetaKey.Selector]}
		{@const network = tonNftTransferSelector.$network}
		<EntityView
			entityType={EntityType.TonNftTransfer}
			entitySelector={tonNftTransferSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nft-transfer/[transferId=stringSegment]/[source=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						transferId: tonNftTransferSelector.transferId,
						source: tonNftTransferSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				TON NFT transfer
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
