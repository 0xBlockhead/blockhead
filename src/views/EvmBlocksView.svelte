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
	}: EntityListViewProps<EntityType.EvmBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmBlock}
	bind:open
	resource={
		selection({
			fields: {
				blockNumber: true,
				hash: true,
			},
		})
	}
>
	{#snippet Item({ item: evmBlock })}
		{@const evmBlockSelector = evmBlock[EntityMetaKey.Selector]}
		{@const network = evmBlockSelector.$network}
		<EntityView
			entityType={EntityType.EvmBlock}
			entitySelector={evmBlockSelector}
			href={
				'blockNumber' in evmBlockSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
						{
							network: (
								'caip2' in network ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							blockNumber: String(evmBlockSelector.blockNumber),
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{`Block #${evmBlock.blockNumber}`}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
