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
	}: EntityListViewProps<EntityType.ArweaveBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ArweaveBlock}
	bind:open
	resource={
		selection({
			fields: {
				height: true,
				timestampMs: true,
				indepHash: true,
			},
		})
	}
>
	{#snippet Item({ item: arweaveBlock })}
		{@const arweaveBlockSelector = arweaveBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ArweaveBlock}
			entitySelector={arweaveBlockSelector}
			href={
				arweaveBlockSelector.indepHash !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/hash/[blockHash=zeroExHexOrStringSegmentOrUtxoTxId]',
						{
							network: (
								arweaveBlockSelector.$network.$network.caip2 !== undefined ?
									caip2StringFromValue(arweaveBlockSelector.$network.$network.caip2)
								:
									arweaveBlockSelector.$network.$network.slug
							),
							blockHash: arweaveBlockSelector.indepHash,
						}
					)
				:
					arweaveBlockSelector.height !== undefined ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
							{
								network: (
									arweaveBlockSelector.$network.$network.caip2 !== undefined ?
										caip2StringFromValue(arweaveBlockSelector.$network.$network.caip2)
									:
										arweaveBlockSelector.$network.$network.slug
								),
								blockNumber: String(arweaveBlockSelector.height),
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{arweaveBlock.height}
			{/snippet}

			{#snippet Value()}
				{arweaveBlock.timestampMs ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
