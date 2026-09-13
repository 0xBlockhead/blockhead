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
	}: EntityListViewProps<EntityType.SolanaBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaBlock}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				slot: true,
				blockHeight: true,
			},
		})
	}
>
	{#snippet Item({ item: solanaBlock })}
		{@const solanaBlockSelector = solanaBlock[EntityMetaKey.Selector]}
		{@const network = solanaBlockSelector.$network}
		<EntityView
			entityType={EntityType.SolanaBlock}
			entitySelector={solanaBlockSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						blockNumber: String(solanaBlockSelector.slot),
					}
				)
			}
		>
			{#snippet Title()}
				{`Slot #${solanaBlockSelector.slot}`}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{solanaBlock.blockHeight ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
