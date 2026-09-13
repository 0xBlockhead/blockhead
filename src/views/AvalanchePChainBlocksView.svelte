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
	}: EntityListViewProps<EntityType.AvalanchePChainBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvalanchePChainBlock}
	bind:open
	resource={
		selection({
			fields: {
				height: true,
				timestampMs: true,
				blockId: true,
			},
		})
	}
>
	{#snippet Item({ item: avalanchePChainBlock })}
		{@const avalanchePChainBlockSelector = avalanchePChainBlock[EntityMetaKey.Selector]}
		{@const network = avalanchePChainBlockSelector.$network}
		<EntityView
			entityType={EntityType.AvalanchePChainBlock}
			entitySelector={avalanchePChainBlockSelector}
			href={
				avalanchePChainBlockSelector.height !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/avalanche-block/[height=nonNegativeBigInt]',
						{
							network: (
								network.caip2 !== undefined ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							height: String(avalanchePChainBlockSelector.height),
						}
					)
				:
					avalanchePChainBlockSelector.blockId !== undefined ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/avalanche-block-id/[blockId=stringSegment]',
							{
								network: (
									network.caip2 !== undefined ?
										caip2StringFromValue(network.caip2)
									:
										network.slug
								),
								blockId: avalanchePChainBlockSelector.blockId,
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{avalanchePChainBlock.height}
			{/snippet}

			{#snippet Value()}
				{avalanchePChainBlock.timestampMs ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
