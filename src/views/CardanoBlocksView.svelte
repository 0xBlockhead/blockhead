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
	}: EntityListViewProps<EntityType.CardanoBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoBlock}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: cardanoBlock })}
		{@const cardanoBlockSelector = cardanoBlock[EntityMetaKey.Selector]}
		{@const network = cardanoBlockSelector.$network}
		<EntityView
			entityType={EntityType.CardanoBlock}
			entitySelector={cardanoBlockSelector}
			href={
				'hash' in cardanoBlockSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/hash/[blockHash=zeroExHexOrStringSegmentOrUtxoTxId]',
						{
							network: (
								'caip2' in network ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							blockHash: cardanoBlockSelector.hash,
						}
					)
				:
					'slot' in cardanoBlockSelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/slot/[slot=nonNegativeBigInt]',
							{
								network: (
									'caip2' in network ?
										caip2StringFromValue(network.caip2)
									:
										network.slug
								),
								slot: String(cardanoBlockSelector.slot),
							}
						)
					:
						'blockNo' in cardanoBlockSelector ?
							resolve(
								'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/cardano/[blockNo=nonNegativeBigInt]',
								{
									network: (
										'caip2' in network ?
											caip2StringFromValue(network.caip2)
										:
											network.slug
									),
									blockNo: String(cardanoBlockSelector.blockNo),
								}
							)
						:
							undefined
			}
		>
			{#snippet Title()}
				Cardano block
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
