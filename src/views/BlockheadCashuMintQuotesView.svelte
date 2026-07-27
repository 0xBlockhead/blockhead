<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadCashuMintQuote> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadCashuMintQuote}
	bind:open
	resource={
		selection({
			fields: {
				quoteId: true,
				amount: true,
				unit: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadCashuMintQuote })}
		{@const blockheadCashuMintQuoteSelector = blockheadCashuMintQuote[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadCashuMintQuote}
			entitySelector={blockheadCashuMintQuoteSelector}
		>
			{#snippet Title()}
				{blockheadCashuMintQuoteSelector.quoteId || 'blockhead Cashu mint quote'}
			{/snippet}

			{#snippet Value()}
				{(String(blockheadCashuMintQuote.amount ?? '') ? String(blockheadCashuMintQuote.amount ?? '') + blockheadCashuMintQuote.unit : '')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
