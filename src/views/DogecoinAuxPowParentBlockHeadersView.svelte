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
	}: EntityListViewProps<EntityType.DogecoinAuxPowParentBlockHeader> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DogecoinAuxPowParentBlockHeader}
	bind:open
	resource={
		selection({
			fields: {
				$auxPow: true,
				merkleRoot: true,
			},
		})
	}
>
	{#snippet Item({ item: dogecoinAuxPowParentBlockHeader })}
		{@const dogecoinAuxPowParentBlockHeaderSelector = dogecoinAuxPowParentBlockHeader[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.DogecoinAuxPowParentBlockHeader}
			entitySelector={dogecoinAuxPowParentBlockHeaderSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/aux-pow/(dogecoinBlockAuxPow)/parent-block-header',
					{
						network: (
							dogecoinAuxPowParentBlockHeaderSelector.$auxPow.$block.$network.caip2 !== undefined ?
								caip2StringFromValue(dogecoinAuxPowParentBlockHeaderSelector.$auxPow.$block.$network.caip2)
							:
								dogecoinAuxPowParentBlockHeaderSelector.$auxPow.$block.$network.slug
						),
						blockNumber: String(dogecoinAuxPowParentBlockHeaderSelector.$auxPow.$block.height),
					}
				)
			}
		>
			{#snippet Title()}
				{`Block #${dogecoinAuxPowParentBlockHeaderSelector.$auxPow.$block.height}`}
			{/snippet}

			{#snippet Value()}
				{dogecoinAuxPowParentBlockHeader.merkleRoot ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
