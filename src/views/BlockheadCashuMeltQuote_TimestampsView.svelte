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
	}: EntityListViewProps<EntityType.BlockheadCashuMeltQuote_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadCashuMeltQuote_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				state: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadCashuMeltQuoteTimestamp })}
		{@const blockheadCashuMeltQuoteTimestampSelector = blockheadCashuMeltQuoteTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadCashuMeltQuote_Timestamp}
			entitySelector={blockheadCashuMeltQuoteTimestampSelector}
		>
			{#snippet Title()}
				{blockheadCashuMeltQuoteTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadCashuMeltQuoteTimestamp.state}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadCashuMeltQuoteTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
