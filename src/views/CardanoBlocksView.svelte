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
	resource={
		selection({
			fields: {
				hash: true,
				slot: true,
				blockNo: true,
			},
		})
	}
>
	{#snippet Item({ item: cardanoBlock })}
		{@const cardanoBlockSelector = cardanoBlock[EntityMetaKey.Selector]}
		{@const network = cardanoBlockSelector.$network}
		<EntityView
			entityType={EntityType.CardanoBlock}
			entitySelector={cardanoBlockSelector}
			href={
				cardanoBlockSelector.hash !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/hash/[blockHash=zeroExHexOrStringSegmentOrUtxoTxId]',
						{
							network: (
								network.caip2 !== undefined ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							blockHash: cardanoBlockSelector.hash,
						}
					)
				:
					cardanoBlockSelector.slot !== undefined ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/slot/[slot=nonNegativeBigInt]',
							{
								network: (
									network.caip2 !== undefined ?
										caip2StringFromValue(network.caip2)
									:
										network.slug
								),
								slot: String(cardanoBlockSelector.slot),
							}
						)
					:
						cardanoBlockSelector.blockNo !== undefined ?
							resolve(
								'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/cardano/[blockNo=nonNegativeBigInt]',
								{
									network: (
										network.caip2 !== undefined ?
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
				{cardanoBlock.hash || 'Cardano block'}
			{/snippet}

			{#snippet Value()}
				{cardanoBlock.slot}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cardanoBlock.blockNo}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
