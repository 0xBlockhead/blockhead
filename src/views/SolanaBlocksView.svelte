<!-- Generated from APP.ts. Do not edit by hand. -->

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
		<EntityView
			entityType={EntityType.SolanaBlock}
			entitySelector={solanaBlockSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
					{
						network: (
							'caip2' in solanaBlockSelector.$network ?
								String(caip2StringFromValue(solanaBlockSelector.$network.caip2))
							:
								String(solanaBlockSelector.$network.slug)
						),
						blockNumber: String(solanaBlockSelector.slot),
					}
				)
			}
		>
			{#snippet Title()}
				{(String(solanaBlockSelector.slot ?? '') ? 'Slot #' + String(solanaBlockSelector.slot ?? '') : '') || 'solana block'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(solanaBlock.blockHeight ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
