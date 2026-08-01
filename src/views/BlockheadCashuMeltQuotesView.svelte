<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.BlockheadCashuMeltQuote> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadCashuMeltQuote}
	bind:open
	resource={
		selection({
			fields: {
				quoteId: true,
				amount: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadCashuMeltQuote })}
		{@const blockheadCashuMeltQuoteSelector = blockheadCashuMeltQuote[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadCashuMeltQuote}
			entitySelector={blockheadCashuMeltQuoteSelector}
		>
			{#snippet Title()}
				{blockheadCashuMeltQuoteSelector.quoteId || 'blockhead Cashu melt quote'}
			{/snippet}

			{#snippet Value()}
				{blockheadCashuMeltQuote.amount ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
