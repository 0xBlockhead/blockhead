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
		title = 'Blocks',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CosmosBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosBlock}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					height: true,
					hash: true,
					transactionCount: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: cosmosBlock })}
		{@const cosmosBlockSelector = cosmosBlock[EntityMetaKey.Selector]}
		{@const network = cosmosBlockSelector.$network}
		<EntityView
			entityType={EntityType.CosmosBlock}
			entitySelector={cosmosBlockSelector}
			href={
				'hash' in cosmosBlockSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/hash/[blockHash=zeroExHexOrStringSegmentOrUtxoTxId]',
						{
							network: (
								'caip2' in network ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							blockHash: cosmosBlockSelector.hash,
						}
					)
				:
					'height' in cosmosBlockSelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
							{
								network: (
									'caip2' in network ?
										caip2StringFromValue(network.caip2)
									:
										network.slug
								),
								blockNumber: String(cosmosBlockSelector.height),
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{`Block #${cosmosBlock.height}`}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cosmosBlock.transactionCount ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
