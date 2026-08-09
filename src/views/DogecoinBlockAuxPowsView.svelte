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
	}: EntityListViewProps<EntityType.DogecoinBlockAuxPow> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DogecoinBlockAuxPow}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$block: true,
					$parentBlockHeader: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: dogecoinBlockAuxPow })}
		{@const dogecoinBlockAuxPowSelector = dogecoinBlockAuxPow[EntityMetaKey.Selector]}
		{@const block = dogecoinBlockAuxPowSelector.$block}
		<EntityView
			entityType={EntityType.DogecoinBlockAuxPow}
			entitySelector={dogecoinBlockAuxPowSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/aux-pow',
					{
						network: (
							'caip2' in block.$network ?
								caip2StringFromValue(block.$network.caip2)
							:
								block.$network.slug
						),
						blockNumber: String(block.height),
					}
				)
			}
		>
			{#snippet Title()}
				{`Block #${dogecoinBlockAuxPowSelector.$block.height}`}
			{/snippet}

			{#snippet Value()}
				{dogecoinBlockAuxPow.$parentBlockHeader == null ? '' : 'dogecoin aux pow parent block header'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
