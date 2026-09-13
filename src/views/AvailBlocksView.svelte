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
	}: EntityListViewProps<EntityType.AvailBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvailBlock}
	bind:open
	resource={
		selection({
			fields: {
				blockNumber: true,
				timestampMs: true,
				blockHash: true,
			},
		})
	}
>
	{#snippet Item({ item: availBlock })}
		{@const availBlockSelector = availBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AvailBlock}
			entitySelector={availBlockSelector}
			href={
				availBlockSelector.blockNumber !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(avail)/block-number/[blockNumber=nonNegativeBigInt]',
						{
							network: (
								availBlockSelector.$network.$network.caip2 !== undefined ?
									caip2StringFromValue(availBlockSelector.$network.$network.caip2)
								:
									availBlockSelector.$network.$network.slug
							),
							blockNumber: String(availBlockSelector.blockNumber),
						}
					)
				:
					availBlockSelector.blockHash !== undefined ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/(avail)/avail/block-hash/[blockHash=stringSegment]',
							{
								network: (
									availBlockSelector.$network.$network.caip2 !== undefined ?
										caip2StringFromValue(availBlockSelector.$network.$network.caip2)
									:
										availBlockSelector.$network.$network.slug
								),
								blockHash: availBlockSelector.blockHash,
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{availBlock.blockNumber}
			{/snippet}

			{#snippet Value()}
				{availBlock.timestampMs ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
