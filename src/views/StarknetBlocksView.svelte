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
	}: EntityListViewProps<EntityType.StarknetBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetBlock}
	bind:open
	resource={
		selection({
			...{
				fields: {
					blockNumber: true,
					blockHash: true,
					status: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: starknetBlock })}
		{@const starknetBlockSelector = starknetBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StarknetBlock}
			entitySelector={starknetBlockSelector}
			href={
				'blockHash' in starknetBlockSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/block/hash/starknet/[blockHash=stringSegment]',
						{
							network: (
								'caip2' in starknetBlockSelector.$network.$network ?
									caip2StringFromValue(starknetBlockSelector.$network.$network.caip2)
								:
									starknetBlockSelector.$network.$network.slug
							),
							blockHash: starknetBlockSelector.blockHash,
						}
					)
				:
					'blockNumber' in starknetBlockSelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/block/number/[blockNumber=nonNegativeBigInt]',
							{
								network: (
									'caip2' in starknetBlockSelector.$network.$network ?
										caip2StringFromValue(starknetBlockSelector.$network.$network.caip2)
									:
										starknetBlockSelector.$network.$network.slug
								),
								blockNumber: String(starknetBlockSelector.blockNumber),
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{starknetBlock.blockNumber}
			{/snippet}

			{#snippet Value()}
				{starknetBlock.blockHash}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{starknetBlock.status ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
